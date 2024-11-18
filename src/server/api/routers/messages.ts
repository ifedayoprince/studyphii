import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Role } from "@prisma/client";
import { generateAIChatResponse } from "../utils/openai";
import { TRPCError } from "@trpc/server";

const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "studyphii"]),
  createdAt: z.date(),
  questionId: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export const messagesRouter = createTRPCRouter({
  getMessages: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.message.findMany({
        where: { questionId: input.questionId },
        orderBy: { createdAt: "asc" },
        take: 20, // Limit to last 20 messages
      });
    }),

  sendMessage: publicProcedure
    .input(z.object({
      content: z.string(),
      questionId: z.string(),
    }))
    .mutation(async function* ({ ctx, input }){
      // Get previous messages for context
      const previousMessages = await ctx.db.message.findMany({
        where: { questionId: input.questionId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      // Create the user message
      const userMessage = await ctx.db.message.create({
        data: {
          content: input.content,
          role: "user",
          questionId: input.questionId,
        },
      });

      // Get the question for additional context
      const question = await ctx.db.question.findUnique({
        where: { id: input.questionId },
      });

      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found',
        });
      }

      // Format messages for OpenAI
      const aiResponse = yield* generateAIChatResponse(question, [...previousMessages, userMessage]);

      if (!aiResponse) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get AI response',
        });
      }

      // Create the AI message
      const aiMessage = await ctx.db.message.create({
        data: {
          content: aiResponse,
          role: Role.studyphii,
          questionId: input.questionId,
        },
      });

      return aiMessage;
    }),
});
