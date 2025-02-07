import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { PricingSlide } from "../PricingSlide";
import PostHogClient from "@/posthog";


export default async function UpgradePage({ searchParams }: { searchParams?: { pt: string | null } }) {
    const session = await getServerAuthSession();
    if (!session)
        redirect("/auth");

    const posthog = PostHogClient();
    posthog.capture({
        distinctId: session.user.id,
        event: "user about to upgrade",
        properties: {
            fromEmail: !!searchParams?.pt
        }
    })
    await posthog.shutdown();

    return <div className="w-full flex justify-center h-full pt-24">
        <PricingSlide />
    </div>
}