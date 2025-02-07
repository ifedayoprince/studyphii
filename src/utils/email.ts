import { env } from "@/env";

export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${env.RESEND_API_KEY}`);

    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
            from: "Phii Space <hello@phii.space>",
            to: [to],
            subject,
            html: body
        })
    })
}

export const SUBSCRIPTION_ACTIVE_EMAIL = (name: string) => `
               <p>Hey ${name},</p>
               <p>Your subscription has been activated successfully. We are excited to have you on board!</p>
               <p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>
               <p>Best regards</p>`;

export const TRIAL_ACTIVATED_EMAIL = (name: string)=> `
               <p>Hey ${name},</p>
               <p>We are thrilled to inform you that your 72-hour unlimited trial has begun!</p><br/>
               <p>Thank you for choosing StudyPhii! We are excited to supercharge you on your learning journey.</p>
               <p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>
               <p>Best regards</p>`;
export const PAYMENT_SUCCEEDED_EMAIL = (name: string)=> `
               <p>Hello ${name},</p>
               <p>We are thrilled to inform you that your lifetime purchase has been successfully.</p><br/>
               <p>Thank you for choosing StudyPhii! We are excited to supercharge you on your learning journey.</p>
               <p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>
               <p>Best regards</p>`;