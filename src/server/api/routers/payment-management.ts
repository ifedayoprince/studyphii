/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion  */
import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env";

export const paymentManagementRouter = createTRPCRouter({
    createCheckout: publicProcedure
        .input(z.object({
                plan: z.enum(["yearly", "lifetime"]),
            }))
        .mutation(async ({ input }) => {
            try {
                
                return {
                    link: ""
                };
            } catch (e) {
                console.log(e)
            }
        })
});