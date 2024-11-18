import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Message, Question, QuestionType } from "@prisma/client";
import { PROMPTS } from "./prompts";
import { env } from "@/env";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const QuestionTypeEnum = z.enum([
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.FILL_IN_BLANKS,
  QuestionType.SUBJECTIVE,
]);

export const GeneratedQuestionSchema = z.object({
  type: QuestionTypeEnum,
  content: z.string().describe("The main question to be displayed to the user. Formulars (if any) should be written in KaTeX format "),
  options: z.array(z.string()).describe("The available options if any. Do not prefix them with any numbering or lettering"),
  answers: z.array(z.string()).describe("The correct answer(s) to the question. If the question type is fill-in-the-blanks, this should be an array of strings each containing the possible correct answers the user could fill in for the {{slot}}. If the question type is multiple-choice, the first item should be the index of the correct answer in the options array."),
});

export const SessionContentSchema = z.object({
  title: z.string().describe("The title of the session to be displayed to the user based on the topic."),
  questions: z.array(GeneratedQuestionSchema).describe("The array of questions. Generate just one"),
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;
export type SessionContent = z.infer<typeof SessionContentSchema>;

export async function generateSessionContent(topic: string, pastQuestions: Question[]): Promise<SessionContent | null> {
  console.log("generating for", topic)
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: PROMPTS.SESSION_GENERATION.system(),
      },
      {
        role: "user",
        content: PROMPTS.SESSION_GENERATION.user(topic, pastQuestions),
      },
    ],
    response_format: zodResponseFormat(SessionContentSchema, "session"),
  });

  console.log(completion)

  return completion?.choices[0]?.message.parsed ?? null;
}

export const generateAIResponse = async (userMessage: string, question: GeneratedQuestion): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: `You are StudyPhii, an AI tutor helping a student understand and learn. 
      The student is asking about this question: "${question.content}"
      ${question.type === "MULTIPLE_CHOICE" ? `It's a multiple choice question with these options: ${question.options.join(", ")}` : ""}
      ${question.type === "FILL_IN_BLANKS" ? `It's a fill-in-the-blanks question with these answers: ${question.answers.join(", ")}` : ""}
      ${question.type === "SUBJECTIVE" ? "It's a subjective/open-ended question." : ""}
      
      Provide helpful, encouraging guidance without directly giving away the answer. Use examples and analogies to help the student understand the concept better.`
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
  }
};

export async function isAnswerCorrect(topic: string, answer: string, question: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: PROMPTS.SUBJECTIVE_ANSWER_VALIDATION.system(topic)
      },
      {
        role: "user",
        content: PROMPTS.SUBJECTIVE_ANSWER_VALIDATION.user(question, answer)
      }
    ],
    temperature: 0.3,
    max_tokens: 10,
  });

  const response = completion.choices[0]?.message?.content?.trim().toUpperCase();
  return response === 'CORRECT';
}

export async function* generateAIChatResponse(question: Question, messages: Message[]) {
  console.log("Calling")
  try {
    const formattedMessages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: [{ type: "text", text: PROMPTS.AI_CHAT.system(question) }]
      },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: [{ type: "text", text: msg.content }],
      }))
    ] as any;

    // Get AI response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const targetIndex = 0;
      const target = chunk.choices[targetIndex];
      const content = target?.delta?.content ?? '';
      yield content;
  
      fullContent += content;
    }

    console.log({ fullContent });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return null;
  }
}