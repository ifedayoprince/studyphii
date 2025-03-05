import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { generateSessionContent } from "../utils/openai";
import { TRPCError } from "@trpc/server";
import PostHogClient from "@/posthog";

export const sessionRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const sessions = await ctx.db.studySession.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          lastActiveAt: 'desc',
        },
        select: {
          id: true,
          topic: true,
          title: true,
          createdAt: true,
          lastActiveAt: true,
        },
      });

      return sessions;
    }),

  create: protectedProcedure
    .input(z.object({
      topic: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate session content using AI
        const content = await generateSessionContent(input.topic , [], 10);

        // Create the session
        const session = await ctx.db.studySession.create({
          data: {
            title: content?.title ?? 'Untitled Session',
            topic: input.topic,
            userId: ctx.session.user.id,
            lastActiveAt: new Date(),
            questions: {
              create: content?.questions.map(q => ({
                type: q.type,
                content: q.content,
                explanation: q.explanation,
                options: q.options ?? [],
                answers: q.answers,
              })),
            },
          },
          include: {
            questions: true,
          },
        });

        const posthog = PostHogClient()
        posthog.capture({
          distinctId: ctx.session?.user?.id,
          event: "session created",
          properties: {
            sessionId: session.id,
            topic: session.topic,
            title: session.title,
          }
        })
        await posthog.shutdown();
        
        return session;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Sorry, we couldn\'t create your study session right now. Please try again in a few moments.',
          cause: error,
        });
      }
    }),
});