import { postRouter } from "@/server/api/routers/post";
import { studyGuideRouter } from "@/server/api/routers/studyGuide";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { pdfRouter } from "@/server/api/routers/pdf";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  studyGuide: studyGuideRouter,
  pdf: pdfRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
