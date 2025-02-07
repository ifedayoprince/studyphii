import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { sendEmail } from "@/utils/email";
import { AES } from "crypto-js";
import { env } from "@/env";
import { headers } from "next/headers";

export async function GET() {
  const signature = (await headers()).get("X-Cron-Signature");
  if (signature != env.CRON_KEY)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const activeTrials = await db.plan.findMany({
    where: { type: "TRIAL", status: "ACTIVE" },
    include: {
      user: true
    }
  });
  console.log(`Found ${activeTrials.length} active trials.`)

  for (const trial of activeTrials) {
    const daysPast = Math.floor((Date.now() - trial.startedAt.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`${daysPast} days past for ${trial.user.email}`)

    const token = AES.encrypt(trial.user.id, env.NEXTAUTH_SECRET ?? "").toString();
    if (daysPast === 1) {
      const sessionsCount = await db.studySession.count({
        where: { userId: trial.user.id }
      });
      await sendTrialReminderEmail(trial.user.name?.split(" ")[0] ?? "there", trial.user.email ?? "", token, sessionsCount);
      console.log(`Sent reminder email to ${trial.user.email}`);
    } else if (daysPast === 2) {
      await sendSecondTrialReminderEmail(trial.user.name?.split(" ")[0] ?? "there", trial.user.email ?? "", token);
      console.log(`Sent update email reminder to ${trial.user.email}`);
    } else if (daysPast == 3) {
      await db.plan.update({
        where: { id: trial.id },
        data: {
          status: "EXPIRED"
        }
      });
      await sendTrialCanceledEmail(trial.user.name?.split(" ")[0] ?? "there", trial.user.email ?? "", token);
      console.log(`Canceled trial for ${trial.user.email}`);
    }
  }

  return NextResponse.json({ message: "Cron job executed successfully" });
}

async function sendTrialReminderEmail(name: string, email: string, token: string, sessionsCount: number) {
  await sendEmail({
    to: email,
    subject: `⚔️ ${name == "there" ? "" : name}! You're Becoming A Weapon`,
    body:
      `<p>Hey ${name},</p>
<p>You've used StudyPhii for 24 hours already and created ${sessionsCount.toLocaleString()} study sessions so far.<br/>
You're on a roll 🚀!</p>
<p>Please upgrade to any of our other plans to not lose access to your sessions once your trial expires.</p>
<p>Click this link to continue:</p><br/>
<a href="https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}">https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}</a>
<br/><br/>
<p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>`,
  });
}
async function sendSecondTrialReminderEmail(name: string, email: string, token: string) {
  await sendEmail({
    to: email,
    subject: `🚨 ${name == "there" ? "" : name}! Your Trial Is About To Expire`,
    body:
      `<p>Hello ${name},</p>
<p>Your special 72-hour trial of StudyPhii is about to expire.</p>
<p>If you'd like to continue your study sessions, please upgrade to any of our other plans.</p>
<p>Click this link to continue:</p><br/>
<a href="https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}">https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}</a>
<br/><br/>
<p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>
`,
  });
}
async function sendTrialCanceledEmail(name: string, email: string, token: string) {
  await sendEmail({
    to: email,
    subject: `🚨 ${name == "there" ? "" : name}! Your Trial Has Expired`,
    body:
      `<p>Hello ${name},</p>
<p>Your trial period for StudyPhii has now expired.</p>
<p>All your study sessions have been saved and you can access them again by upgrading to any of our plans.</p>
<br/>
<p>Click this link to upgrade your account:</p><br/>
<a href="https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}">https://study.phii.space/session/upgrade?pt=${encodeURIComponent(token)}</a>
<br/><br/>
<p>If you have any questions or need assistance, feel free to reach out by replying this email.</p>`,
  });
} 