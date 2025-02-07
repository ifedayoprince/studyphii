"use client";

import { Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getTimeRemaining(trialStartedAt: Date) {
  const TRIAL_DURATION = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
  const now = new Date().getTime();
  const startTime = new Date(trialStartedAt).getTime();
  const timeElapsed = now - startTime;
  const timeRemaining = TRIAL_DURATION - timeElapsed;

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, timeRemaining };
}

export function TrialChip() {
  const { data: session } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!session?.user) return;
    if (!session?.user.plan?.trialStartedAt) return;

    const updateTimer = () => {
      const remaining = getTimeRemaining(session!.user!.plan!.trialStartedAt!);
      if (remaining.timeRemaining <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: remaining.hours,
        minutes: remaining.minutes,
        seconds: remaining.seconds
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval);
  }, [session]);

  if (session?.user?.plan?.type != "TRIAL") return null;
  if (session?.user?.plan?.status != "ACTIVE") return null;

  return (
    <button className="absolute bottom-4 left-4 z-[100] bg-warning-50 text-warning-600 rounded-full px-3 py-1" onClick={()=> {router.push("/session/upgrade")}}>
      <Tooltip content="Click to upgrade before your trial runs out!">
        <div className="text-sm">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </Tooltip>
    </button>
  );
}