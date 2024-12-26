import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateSessionContent, validateAnswerCorrect } from "../utils/openai";
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
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          content: true,
          type: true,
          options: true,
          answers: true,
          explanation: true,
          userAnswer: true,
          isCorrect: true,
          discussion: {
            select: {
              id: true
            }
          }
        }
      });
      const session = await ctx.db.studySession.findUnique({
        where: { id: input.sessionId },
        select: {
          refinePrompt: true
        }
      })

      const formattedQuestions = questions.map(question => ({
        ...question,
        hasDiscussion: question.discussion.length > 0
      }));
      return {
        refinePrompt: session?.refinePrompt,
        questions: formattedQuestions
      }
    }),

  validateSubjectiveAnswer: protectedProcedure
    .input(z.object({
      questionId: z.string(),
      answer: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the question and its associated session
      const question = await ctx.db.question.findFirst({
        where: { id: input.questionId }
      });

      if (!question || question.type == QuestionType.MULTIPLE_CHOICE) {
        throw new Error("Question not found or is not supported.");
      }

      const isCorrect = await validateAnswerCorrect(input.answer, question.content);

      // Update the question with user's answer and result
      await ctx.db.question.update({
        where: { id: input.questionId },
        data: {
          userAnswer: input.answer,
          isCorrect: isCorrect !== "INCORRECT",
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

  generateMoreQuestions: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      referenceQuestionId: z.string().optional(),
      refinePrompt: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the session to access the topic
      const session = await ctx.db.studySession.findUnique({
        where: { id: input.sessionId },
        select: {
          topic: true,
          refinePrompt: true,
          questions: {
            take: 20
          }
        }
      });
      if (!session)
        throw new Error("Session not found");

      let question = null;
      if (input.referenceQuestionId) {
        question = await ctx.db.question.findUnique({
          where: { id: input.referenceQuestionId },
          select: {
            content: true,
            type: true
          }
        })
      }


      let refinePrompt: string | null = session.refinePrompt ?? null;
      if (input.refinePrompt) {
        refinePrompt = (session.refinePrompt
          ? "\n" : "") + input.refinePrompt
      } else if (question) {
        refinePrompt =
          `The user wants more questions like this:\n\n${question.content} (${question.type})`
      }


      // Generate new questions using AI with existing questions as context
      const content = await generateSessionContent(session.topic, session.questions, 3, refinePrompt ?? undefined);

      if (!content?.questions.length)
        throw new Error("Failed to generate new questions");

      let data: any = {
        refinePrompt: refinePrompt ?? undefined,
        questions: {
          create: content.questions.map(q => ({
            type: q.type,
            content: q.content,
            explanation: q.explanation,
            options: q.options ?? [],
            answers: q.answers
          })),
        },
        lastActiveAt: new Date(),
      }
      if (input.referenceQuestionId)
        data = {
          questions: {
            create: content.questions.map(q => ({
              type: q.type,
              content: q.content,
              explanation: q.explanation,
              options: q.options ?? [],
              answers: q.answers
            })),
          },
          lastActiveAt: new Date(),
        }

      // Add the new questions to the session
      let updatedSession = await ctx.db.studySession.update({
        where: { id: input.sessionId },
        data,
      });

      return {
        success: true,
        refinePrompt: updatedSession.refinePrompt || ""
      };
    }),
});
