import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateAIResponse, isAnswerCorrect } from "../utils/openai";
import { QuestionType } from "@prisma/client";

export const questionsRouter = createTRPCRouter({
  getSessionQuestions: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          sessionId: input.sessionId,
        },
        select: {
          id: true,
          content: true,
          type: true,
          options: true,
          answers: true,
          userAnswer: true,
          isCorrect: true,
          discussion: {
            select: {
              id: true
            }
          }
        }
      });

      return questions.map(question => ({
        ...question,
        hasDiscussion: question.discussion.length > 0
      }));
    }),

  validateSubjectiveAnswer: protectedProcedure
    .input(z.object({
      questionId: z.string(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the question and its associated session
      const question = await ctx.db.question.findFirst({
        where: { id: input.questionId },
        include: {
          session: true // Include the session to get the topic
        }
      });

      if (!question || question.type !== QuestionType.SUBJECTIVE) {
        throw new Error("Question not found or not subjective type");
      }

      const topic = question.session?.topic || "";
      const isCorrect = await isAnswerCorrect(topic, input.answer, question.content);

      // Update the question with user's answer and result
      await ctx.db.question.update({
        where: { id: input.questionId },
        data: {
          userAnswer: input.answer,
          isCorrect,
          answeredAt: new Date()
        },
      });

      return { isCorrect };
    }),

  updateQuestionAnswer: protectedProcedure
    .input(z.object({
      questionId: z.string(),
      answer: z.string(),
      isCorrect: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the question to verify it's not subjective
      const question = await ctx.db.question.findUnique({
        where: { id: input.questionId },
        select: { type: true }
      });

      if (!question || question.type === QuestionType.SUBJECTIVE) {
        throw new Error("Question not found or is subjective type");
      }

      // Update the question with user's answer and result
      return ctx.db.question.update({
        where: { id: input.questionId },
        data: {
          userAnswer: input.answer,
          isCorrect: input.isCorrect,
          answeredAt: new Date(),
        },
      });
    }),
});
