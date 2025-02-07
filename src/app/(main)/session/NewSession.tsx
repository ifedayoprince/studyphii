"use client";

import { Textarea, Button } from "@nextui-org/react";
import { ArrowUpIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";


export function NewSession() {
    const [input, setInput] = useState("");
    const router = useRouter();
    const { data: session } = useSession();
    const isOnline = useOnlineStatus();
    const path = useSearchParams();
    const utils = api.useUtils();
    const { mutate: createSession, isPending } = api.session.create.useMutation({
        onSuccess: async (session) => {
            await utils.session.getHistory.cancel();

            // Optimistically update the cache
            utils.session.getHistory.setData(undefined, (old) => {
                const optimisticSession = {
                    id: session.id,
                    title: session.title,
                    topic: session.topic,
                    createdAt: session.createdAt,
                    lastActiveAt: session.lastActiveAt,
                };

                if (!old) return [optimisticSession];
                return [optimisticSession, ...old];
            });

            router.push(`/session/${session.id}`);
        },
    });

    useEffect(() => {
        // console.log(path, path.get("login"))
        if (path.get("login")) {
            posthog.identify(session?.user.id, {}, {
                email: session?.user.email,
                name: session?.user.name,
                referrer: session?.user.referrer
            });
            posthog.capture("user logged in");
            router.replace("/session")
        }
    }, [path])
    const handleSubmit = () => {
        if (!isOnline) {
            toast({
                title: "You are offline!",
                description: "Please connect to the internet to create a session",
            });
            return;
        };
        const trimmedInput = input.trim();
        if (trimmedInput) {
            createSession({ topic: trimmedInput });
        }
    };

    const quickStarts = [
        "Questions on thermodynamics",
        "Elements in the periodic table",
        "Integral Calculus"
    ];

    return (
        <div className="flex max-w-2xl flex-col items-center justify-center gap-5 h-full w-full pb-16">
            <h2 className="text-4xl md:text-5xl md:scale-90 text-center font-semibold mb-4">
                What can I help you learn?
            </h2>

            <div className="relative w-full">
                <Textarea
                    minRows={1}
                    maxRows={5}
                    height={"100%"}
                    variant="bordered"
                    className="text-[0.925rem]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask StudyPhii a question..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    endContent={
                        <Button
                            className="mt-5 self-end"
                            disabled={!input.trim() || isPending}
                            variant={!input.trim() ? "flat" : "shadow"}
                            color="primary"
                            isIconOnly
                            onClick={handleSubmit}
                            isLoading={isPending}
                        >
                            <ArrowUpIcon />
                        </Button>
                    }
                />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {quickStarts.map((quickStart, index) => (
                    <button
                        key={index}
                        onClick={() => setInput(quickStart)}
                        className="flex gap-2 items-center rounded-full px-2 py-1 border
                                bg-white/80 hover:bg-white
                                dark:bg-black/80 dark:hover:bg-black/40 
                                backdrop-blur-sm 
                                cursor-pointer text-xs font-medium transition-colors"
                    >
                        {quickStart} <ExternalLinkIcon />
                    </button>
                ))}
            </div>
        </div>
    );
}