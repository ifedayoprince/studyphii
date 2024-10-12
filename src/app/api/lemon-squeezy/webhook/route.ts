import { env } from "@/env";
import { db } from "@/server/db";
import { createHmac, timingSafeEqual } from "crypto";
import { LemonsqueezyWebhookPayload } from "./types";

const STUDYSPACE_VARIANT_ID = 545976;
export async function POST(request: Request) {
    if (!env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
        return new Response("Lemon Squeezy Webhook Secret not set", { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("X-Signature");

    if (!verifySignature(rawBody, signature, env.LEMON_SQUEEZY_WEBHOOK_SECRET)) {
        return new Response("Invalid signature", { status: 400 });
    }

    const data = JSON.parse(rawBody) as LemonsqueezyWebhookPayload;

    if (!data.meta) {
        return new Response("Invalid webhook payload", { status: 400 });
    }

    await processWebhook(data);

    return new Response("OK", { status: 200 });
}

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature) return false;
    const hmac = createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(payload).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");
    return timingSafeEqual(digest, signatureBuffer);
}

async function processWebhook(data: LemonsqueezyWebhookPayload) {
    const { event_name, custom_data } = data.meta;
    const attributes = data.data.attributes;

    const createdWebhook = await db.lemonSqueezyWebhookEvent.create({
        data: {
            eventName: event_name,
            processed: false,
            body: data as any,
        },
    });

    if (event_name === "order_created" && attributes.status === "paid" && attributes.first_order_item.variant_id === STUDYSPACE_VARIANT_ID) {
        console.log(data);
        await createOneTimePayment(data.data.id, attributes, custom_data.study_guide_id, attributes.user_email);
        // Uncomment if you want to send Slack notifications
        // await slackNewPaymentNotification.invoke({
        //   user: { email: attributes.user_email, id: attributes.user_id },
        //   productName: attributes.first_order_item.variant_name,
        // });
    }

    await db.lemonSqueezyWebhookEvent.update({
        where: { id: createdWebhook.id },
        data: { processed: true },
    });
}

async function createOneTimePayment(lmsId: string, orderData: any, studyGuideId: string, customerEmail: string) {
    await db.lemonSqueezyOneTimePayment.create({
        data: {
            amount: orderData.total/100,
            currency: orderData.currency,
            status: orderData.status,
            lemonSqueezyId: lmsId,
            studyGuideId,
        },
    });

    await db.studyGuide.update({
        where: { id: studyGuideId },
        data: { generatedFor: customerEmail, isDownloaded: true },
    });
}
