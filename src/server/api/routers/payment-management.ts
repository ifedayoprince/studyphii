/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion  */
import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import {
    createCheckout,
    lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "@/env";
import { db } from "@/server/db";


const setupLemonSqueezy = () => {
    lemonSqueezySetup({
        apiKey: env.LEMON_SQUEEZY_API_KEY,
        onError(error) {
            console.log(error);
        },
    });
};

const STUDYSPACE_VARIANT_ID = 545976;

export const paymentManagementRouter = createTRPCRouter({
    createCheckoutForVariant: publicProcedure
        .input(
            z.object({
                guideId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            setupLemonSqueezy();

            if (!env.LEMON_SQUEEZY_STORE_ID) {
                throw new Error(
                    "Missing required LEMON_SQUEEZY_STORE_ID env variable. Please, set it in your .env file.",
                );
            }

            try {
                const checkout = await createCheckout(
                    env.LEMON_SQUEEZY_STORE_ID,
                    STUDYSPACE_VARIANT_ID,
                    {
                        checkoutData: {
                            custom: {
                                studyGuideId: input.guideId,
                            },
                        },
                        productOptions: {
                            redirectUrl: `${env.HOSTED_URL}`,
                            receiptLinkUrl: `${env.HOSTED_URL}/download/${input.guideId}`,
                        },
                        checkoutOptions: {
                            embed: true,
                            media: false,
                            logo: false,
                            desc: false,
                        },
                    },
                );
                console.log(checkout)
                return checkout;
            } catch (e) {
                console.log(e)
            }
        }),
    getGuidePurchase: publicProcedure.query(async ({ ctx }) => {
        // const oneTimePurchases = await db.lemonSqueezyOneTimePayment.findMany({
        //   where: {
        //     userId: ctx.session.user.id,
        //   },
        // });

        // return oneTimePurchases;
    })
});