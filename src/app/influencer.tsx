"use client"
import { api } from "@/trpc/react";
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { useEffect } from "react";
import { Session } from "next-auth";

export const InfluencerTracker = ({session}: {session: Session | null}) => {
    const updateReferrer = api.users.updateReferrer.useMutation({
        onSuccess: () => {
            deleteCookie('ic')
        }
    });


    useEffect(() => {
        const url = new URL(window.location.href);

        // Get the influencer code from the URL
        const influencerParam = url.searchParams.get("ic");
        const influencerCookie = getCookie('ic');

        if (influencerParam && !session) {
            setCookie('ic', influencerParam, {
                path: "/",
                maxAge: 60 * 60 * 24 * 60, // 60 days
            });
        }

        if (influencerCookie && session) {
            updateReferrer.mutate({
                influencerCode: influencerCookie as string,
            })
        }
    }, [])

    return <p></p>
}