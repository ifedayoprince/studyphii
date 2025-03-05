import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";


export const paymentManagementRouter = createTRPCRouter({
  createCheckout: publicProcedure
    .input(z.object({
      userId: z.string(),
      plan: z.enum(["trial", "yearly", "lifetime"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const ipAddress = ctx.headers.get('x-forwarded-for') ?? ""; 

      let billingInfo = {} as any;
      try {
        const response = await fetch(`https://freeipapi.com/api/json/${ipAddress}`);
        console.log(ipAddress, await response.text())
        billingInfo = JSON.parse(await response.text());
      } catch (error) { }

      const billingData = {
        city: billingInfo?.cityName || "San Francisco",
        country: billingInfo?.countryCode || "US",
        state: billingInfo?.regionName || "CA",
        street: "123 Market Street",
        zipcode: billingInfo?.zipCode || "94103"
      };

      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId
        },
        select: {
          email: true,
          id: true,
          payments: {
            where: {
              type: "TRIAL"
            }
          }
        }
      });

      const hasTakenTrial = (user?.payments ?? []).length > 0 || false;
      if (hasTakenTrial && input.plan == "trial") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You've already used your free trial. Please choose a paid plan to continue using our service."
        });
      }

      try {
        let link = "";
        const host = env.NEXT_PUBLIC_ENV == "production" ? "https://live.dodopayments.com" : "https://test.dodopayments.com";
        
        if (input.plan === "yearly") {
          const response = await fetch(`${host}/subscriptions`, {
            method: "POST",
            body: JSON.stringify({
              billing: billingData,
              customer: {
                email: ctx.session?.user.email,
                name: ctx.session?.user.name
              },
              metadata: { userId: ctx.session?.user.id },
              product_id: env.NEXT_PUBLIC_ENV == "production" ? "pdt_DdMXRcvIBZeayeftj2Aed" : "pdt_sOOK8fNIzvzRc116OScUj",
              quantity: 1,
              payment_link: true,
              return_url: `${env.HOSTED_URL}/congratulations`
            }),
            headers: {
              "Authorization": `Bearer ${env.DODOPAYMENTS_API_KEY}`,
              "Content-Type": "application/json"
            }
          });

          const data = await response.json();
          link = data.payment_link;
        } else if (input.plan === "lifetime") {
          const response = await fetch(`${host}/payments`, {
            method: "POST",
            body: JSON.stringify({
              billing: billingData,
              customer: {
                email: ctx.session?.user.email,
                name: ctx.session?.user.name
              },
              metadata: { userId: ctx.session?.user.id },
              return_url: `${env.HOSTED_URL}/congratulations`,
              product_cart: [
                {
                  product_id: env.NEXT_PUBLIC_ENV == "production" ? "pdt_ZvTshfL8g6szi9xB20amq" : "pdt_ZGYAD8yfzFxOv8iFFgDUG",
                  quantity: 1
                }
              ],
              payment_link: true
            }),
            headers: {
              "Authorization": `Bearer ${env.DODOPAYMENTS_API_KEY}`,
              "Content-Type": "application/json"
            }
          });

          const data = await response.json();
          link = data.payment_link;
        } else if (input.plan === "trial") {
          const response = await fetch(`${host}/payments`, {
            method: "POST",
            body: JSON.stringify({
              billing: billingData,
              customer: {
                email: ctx.session?.user.email,
                name: ctx.session?.user.name
              },
              metadata: { userId: ctx.session?.user.id },
              return_url: `${env.HOSTED_URL}/congratulations`,
              product_cart: [
                {
                  product_id: env.NEXT_PUBLIC_ENV == "production" ? "pdt_RyLrnkiBMWPlEuJxyuAyl" : "pdt_5mchpws2rFiGNBHTlR113",
                  quantity: 1
                }
              ],
              payment_link: true
            }),
            headers: {
              "Authorization": `Bearer ${env.DODOPAYMENTS_API_KEY}`,
              "Content-Type": "application/json"
            }
          });

          const data = JSON.parse(await response.text());
          link = data.payment_link;
        }

        return {
          link
        }
      } catch (e) {
        console.log(e)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, we couldn't process your payment request at the moment. Please try again later or contact support if the issue persists."
        });
      }
    })
});