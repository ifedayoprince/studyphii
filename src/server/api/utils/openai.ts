import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Message, Question, QuestionType } from "@prisma/client";
import { PROMPTS } from "./prompts";
import { env } from "@/env";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { wrapOpenAI } from "langsmith/wrappers";
import { traceable } from "langsmith/traceable";
import { RunTree } from "langsmith";
import { TRPCError } from "@trpc/server";

const openai = wrapOpenAI(new OpenAI({
  apiKey: env.OPENAI_API_KEY,
}));


const QuestionTypeEnum = z.enum([
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.FILL_IN_BLANKS,
  QuestionType.SUBJECTIVE,
]);

export const GeneratedQuestionSchema = z.object({
  type: QuestionTypeEnum,
  content: z.string().describe("The main question to be displayed to the user. Formulars (if any) should be written in KaTeX format "),
  options: z.array(z.string()).describe("The available options if any. Do not prefix them with any numbering or lettering"),
  answers: z.array(z.string()).describe("The correct answer(s) to the question. If the question type is fill-in-the-blanks, this should be an array of strings each containing the possible correct answers the user could fill in for the {{slot}}. If the question type is multiple-choice, the first item should be the index of the correct answer in the options array (the index starts at 0). If the question is a subjective question, this bean array with the first item being a clear, correct and concise answer to the question asked"),
  explanation: z.string().describe("An explanation of the answer(s) to the question. This should be a concise and direct explanation of why the answer is correct. It should be no more than 100 words."),
});

export const SessionContentSchema = z.object({
  title: z.string().describe("The session's title. It should be able to summarize the user's input. Be as concise as possible, yet specific enough. It must be no more than 6 words and no less than 2."),
  questions: z.array(GeneratedQuestionSchema),
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;
export type SessionContent = z.infer<typeof SessionContentSchema>;

export async function generateSessionContent(topic: string, pastQuestions: Question[], questionLength: number, refinePrompt?: string): Promise<SessionContent | null> {
  const pipeline = new RunTree({
    name: "Generate Session Questions",
    run_type: "llm",
    inputs: { topic, pastQuestions, questionLength, refinePrompt },
  });
  await pipeline.postRun();

  try {

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPTS.SESSION_GENERATION.system(questionLength),
        },
        {
          role: "user",
          content: PROMPTS.SESSION_GENERATION.user(topic, pastQuestions, refinePrompt),
        },
      ],
      response_format: zodResponseFormat(SessionContentSchema, "session"),
    });

    const result = completion?.choices[0]?.message.parsed ?? null;
    pipeline.end({ result });
    await pipeline.patchRun();

    return result;
  } catch (error: any) {
    console.error("Error generating session content:", error);

    pipeline.createChild({
      name: "Error Handling",
      run_type: "llm",
      inputs: { error: error.message, stack: error.stack },
    });

    pipeline.end({ error: "An error occurred during session generation." }, error.message);
    await pipeline.patchRun();

    throw new TRPCError({
      message: "An error occurred during session generation.",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}

export async function validateAnswerCorrect(answer: string, question: string) {
  const pipeline = new RunTree({
    name: "Answer Validation",
    run_type: "llm",
    inputs: { question, answer },
  });
  await pipeline.postRun();

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPTS.SUBJECTIVE_ANSWER_VALIDATION.system(question),
        },
        {
          role: "user",
          content: PROMPTS.SUBJECTIVE_ANSWER_VALIDATION.user(answer),
        },
      ],
      response_format: zodResponseFormat(z.object({
        answer: z.enum(["CORRECT", "INCORRECT", "TRACK"])
      }), "answer"),
    });

    const result = completion?.choices[0]?.message.parsed?.answer ?? null;
    pipeline.end({ result });
    await pipeline.patchRun();

    return result;
  } catch (error: any) {
    console.error("Error validating answer:", error);

    pipeline.createChild({
      name: "Error Handling",
      run_type: "llm",
      inputs: { error: error.message, stack: error.stack },
    });

    pipeline.end({ error: "An error occurred during answer validation." }, error.message);
    await pipeline.patchRun();

    throw new TRPCError({
      message: "An error occurred during answer validation.",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}

export async function* generateAIChatResponse(question: Question, messages: Partial<Message>[]) {
  // Initialize the RunTree pipeline
  const pipeline = new RunTree({
    name: "AI Chat",
    run_type: "chain",
    inputs: { question, messages },
  });
  await pipeline.postRun();

  try {
    // Prepare the system prompt and formatted messages
    const formattedMessages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: [{ type: "text", text: PROMPTS.AI_CHAT.system(question) }],
      },
      ...messages.map((msg) => ({
        role: msg?.role === "user" ? "user" : "assistant",
        content: [{ type: "text", text: msg?.content || "" }],
      })),
    ] as any;

    const openAIChildRun = pipeline.createChild({
      name: "OpenAI Call",
      run_type: "llm",
      inputs: { formattedMessages },
    });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const targetIndex = 0;
      const target = chunk.choices[targetIndex];
      const content = target?.delta?.content ?? '';
      yield content;

      fullContent += content;

      // Log incremental responses as child runs
      const streamChunkRun = openAIChildRun.createChild({
        name: "Stream Chunk",
        run_type: "llm",
        inputs: { contentChunk: content },
      });
      streamChunkRun.end({ contentChunk: content });
      await streamChunkRun.postRun();
    }

    // End OpenAI child run
    openAIChildRun.end({ fullContent });
    await openAIChildRun.postRun();

    // Log the full content as the final output
    pipeline.end({ fullContent });
    await pipeline.patchRun();

    return fullContent;

  } catch (error: any) {
    console.error("Error generating AI response:", error);

    // Log error to the pipeline
    pipeline.createChild({
      name: "Error Handling",
      run_type: "llm",
      inputs: { error: error.message, stack: error.stack },
    });

    pipeline.end({ error: "An error occurred during response generation." }, error.message);
    await pipeline.patchRun();

    yield "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?";
  }
}