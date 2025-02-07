import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  updateReferrer: protectedProcedure
    .input(z.object({
      influencerCode: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({ where: { id: ctx.session?.user.id } });
      if (user?.referrer)
        return "failed"

      await ctx.db.user.update({
        where: {
          id: ctx.session?.user?.id ?? ""
        },
        data: {
          referrer: input.influencerCode
        }
      })

      return "success"
    })
})
