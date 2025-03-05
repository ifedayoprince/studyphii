import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Role } from "@prisma/client";
import { generateAIChatResponse } from "../utils/openai";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import PostHogClient from "@/posthog";



const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "studyphii"]),
  createdAt: z.date(),
  questionId: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export const messagesRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.message.findMany({
        where: {
          questionId: input.questionId,
          question: {
            session: {
              userId: ctx.session?.user.id
            }
          }
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 20
      });
    }),

  stopStreaming: protectedProcedure
    .input(z.object({
      questionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.findFirst({
        where: {
          questionId: input.questionId,
          role: "studyphii",
          isAborted: false,
          isComplete: false,
          question: {
            session: {
              userId: ctx.session?.user.id
            }
          }
        }
      })
      if (!message) return false;

      await ctx.db.message.update({
        where: {
          id: message.id
        },
        data: {
          isAborted: true
        }
      });
      return true;
    }),

  sendMessage: protectedProcedure
    .input(z.object({ content: z.string(), questionId: z.string() }))
    .mutation(async function* ({ ctx, input }) {
      // Get previous messages for context
      const previousMessages = await ctx.db.message.findMany({
        where: { 
          questionId: input.questionId,
          question: {
            session: {
              userId: ctx.session?.user.id
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      if (previousMessages.length == 0) {
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: ctx.session?.user?.id,
          event: "ai chat started",
          properties: {
            questionId: input.questionId
          }
        });
        await posthog.shutdown();
      }


      // Get the question for additional context
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.questionId,
          session: {
            userId: ctx.session?.user.id
          }
        },
      });

      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "We couldn't find this question. Please try again or start a new session.",
        });
      }

      let fullResponse = "";
      let failed = false;

      try {
        // Format messages for OpenAI
        for await (const chunk of generateAIChatResponse(question, [...previousMessages, { content: input.content, role: "user" }])) {
          fullResponse += chunk;
          yield chunk;
        }

        // Create the user message
        await ctx.db.message.create({
          data: {
            content: input.content,
            role: "user",
            questionId: input.questionId,
            isAborted: false,
            isComplete: true
          },
        });

        const aiMessage = await ctx.db.message.create({
          data: {
            content: fullResponse,
            role: "studyphii",
            questionId: input.questionId,
            isAborted: false,
            isComplete: !failed
          },
        });

        yield aiMessage;
      } catch (error) {
        await ctx.db.message.create({
          data: {
            content: input.content,
            role: "user",
            questionId: input.questionId,
            isAborted: false,
            isComplete: true
          },
        });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "We couldn't generate a response at this time. Please try again in a few moments.",
        });
      }
    }),
});
