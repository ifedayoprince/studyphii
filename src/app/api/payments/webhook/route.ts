import { Webhook } from 'standardwebhooks';
import { headers } from "next/headers";
import { PAYMENT_SUCCEEDED_EMAIL, sendEmail, SUBSCRIPTION_ACTIVE_EMAIL, TRIAL_ACTIVATED_EMAIL } from "@/utils/email";
import { env } from '@/env';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import PostHogClient from '@/posthog';


const webhook = new Webhook(env.DODOPAYMENTS_WEBHOOK_KEY);

export async function POST(request: Request) {
  const headersList = await headers();
  const rawBody = await request.text();

  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  await webhook.verify(rawBody, webhookHeaders);
  const payload = JSON.parse(rawBody);

  switch (payload.type) {
    case "subscription.active": {
      const userId = payload.data?.metadata?.userId;
      const plan = await db.plan.upsert({
        where: { userId },
        update: {
          type: "SUBSCRIPTION",
          status: "ACTIVE",
          renewsAt: payload.data?.next_billing_date,
          paymentId: payload.data?.subscription_id,
        },
        create: {
          userId,
          type: "SUBSCRIPTION",
          status: "ACTIVE",
          renewsAt: payload.data?.next_billing_date,
          paymentId: payload.data?.subscription_id,
        },
      });

      await db.payment.create({
        data: {
          userId,
          type: "SUBSCRIPTION",
          status: "SUCCESS",
          paymentRef: payload.data?.subscription_id as string,
          metadata: JSON.stringify(payload),
          planId: plan.id,
          amount: payload.data?.recurring_pre_tax_amount,
        },
      });

      const name = payload.data?.customer.name.split(" ")[0];
      await sendEmail({
        to: payload.data?.customer.email,
        subject: `Congrats ${name}! Your Academic Comeback Begins ⚔️`,
        body: SUBSCRIPTION_ACTIVE_EMAIL(name),
      });
      break;
    }
    case "subscription.cancelled": {
      const userId = payload.data?.customer.userId;
      await db.plan.update({
        where: { id: userId },
        data: { status: "CANCELED", canceledAt: new Date() },
      });

      await sendEmail({
        to: payload.data?.customer.email,
        subject: "Subscription Cancelled Successfully",
        body: `<p>Your subscription has been cancelled.\n\nIf this was a mistake, please contact support (<a href="mailto:hello@phii.space">hello@phii.space</a>).</p>`,
      });
      break;
    }
    case "payment.succeeded": {
      const TRIAL_PRODUCT_ID = env.NEXT_PUBLIC_ENV == "production" ? "pdt_RyLrnkiBMWPlEuJxyuAyl" : "pdt_5mchpws2rFiGNBHTlR113";
      const userId = payload.data?.metadata?.userId;

      const isTrial = payload.data?.product_cart[0]?.product_id == TRIAL_PRODUCT_ID;
      const isSubscription = await db.plan.findFirst({
        where: {
          userId,
          type: "SUBSCRIPTION",
          paymentId: payload.data?.subscription_id,
        }
      });

      const posthog = PostHogClient();
      posthog.capture({
        event: "user purchased plan",
        distinctId: userId,
        properties: {
          plan: isTrial
            ? "TRIAL"
            : isSubscription
              ? "YEARLY"
              : "LIFETIME",
          price: payload.data?.metadata?.price,
          currency: payload.data?.metadata?.currency,
          subscriptionId: payload.data?.subscription_id,
          customerEmail: payload.data?.customer.email,
          customerName: payload.data?.customer.name,
        }
      });
      await posthog.flush();

      if (isSubscription)
        return NextResponse.json({ message: "subscribed" });

      const hasTakenTrial = !!(await db.payment.findFirst({
        where: { userId, type: "TRIAL" }
      }));
      if (hasTakenTrial)
        return NextResponse.json({ message: "already subscribed" }, { status: 400 });

      const plan = await db.plan.upsert({
        where: { userId },
        update: {
          type: isTrial ? "TRIAL" : "LIFETIME",
          status: "ACTIVE",
          paymentId: payload.data?.subscription_id,
        },
        create: {
          userId,
          type: isTrial ? "TRIAL" : "LIFETIME",
          status: "ACTIVE",
          paymentId: payload.data?.subscription_id,
        },
      });

      console.log(payload.data);
      await db.payment.create({
        data: {
          userId,
          type: isTrial ? "TRIAL" : "LIFETIME",
          status: "SUCCESS",
          paymentRef: payload.data?.payment_id as string,
          metadata: JSON.stringify(payload),
          planId: plan.id,
          amount: payload.data?.total_amount,
        },
      });

      const name = payload.data?.customer.name.split(" ")[0];
      if (isTrial) {
        posthog.capture({
          event: "user purchased trial",
          distinctId: userId,
        })
        await sendEmail({
          to: payload.data?.customer.email,
          subject: `Congrats ${name}! Your 72-Hour UNLIMITED Access Begins Now! 🎉`,
          body: TRIAL_ACTIVATED_EMAIL(name),
        });

        await posthog.shutdown();
        break;
      }

      await sendEmail({
        to: payload.data?.customer.email,
        subject: `Congrats ${name}! You Have Lifetime Access to StudyPhii! 🎉`,
        body: PAYMENT_SUCCEEDED_EMAIL(name),
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${payload.type}`);
  }

  return NextResponse.json({ message: "ok" }, { status: 200 });
}
