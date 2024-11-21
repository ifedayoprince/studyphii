"use client";

import { Avatar, Button } from "@nextui-org/react"
import { useState } from "react";
import { TopicModal } from "./TopicModal";
import { EndSessionModal } from "./EndSessionModal";
import { useRouter } from "next/navigation";
import { SidebarRight } from "iconsax-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

interface SessionHeaderProps {
    onOpenSidebar: () => void;
    openSidebar: boolean;
    newSession?: boolean;
}

export const SessionHeader = ({ onOpenSidebar, openSidebar, newSession }: SessionHeaderProps) => {
    const { data } = useSession();
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [topicModalContent, setTopicModalContent] = useState("");
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const sessionId = params.session_id as string;
    const [isGenerating, setIsGenerating] = useState(false);
    const generateQuestions = api.questions.generateMoreQuestions.useMutation();

    const handleRefinePrompt = async (topic: string) => {
        setIsGenerating(true);
        try {
            const res = await generateQuestions.mutateAsync({
                sessionId,
                refinePrompt: topic
            });
            setTopicModalContent(res.refinePrompt)
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEndSession = () => {
        // TODO: Implement session end logic
        router.push("/session");
    };

    return (
        <>
            <nav className={`${newSession && "absolute top-0"} flex items-center justify-between py-4 px-10 z-10 backdrop-blur-md w-full`}>
                <div className="flex items-center gap-2">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: openSidebar ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onClick={onOpenSidebar}
                            className={openSidebar ? "pointer-events-none hidden" : ""}
                        >
                            <SidebarRight variant="TwoTone" />
                        </Button>
                    </motion.div>
                    {!newSession && <h2 className="text-xl font-medium">
                        StudyPhii
                    </h2>
                    }
                </div>
                {newSession
                    ? <Avatar
                        size="md"
                        isBordered as="button"
                        src={data?.user?.image || "https://placekitten.com/200/200"} />
                    : <div className="flex gap-3">
                        <Button
                            variant="shadow"
                            color="primary"
                            onClick={() => setIsTopicModalOpen(true)}
                            isLoading={isGenerating}
                        >
                            Refine
                        </Button>
                        <Button
                            variant="light"
                            color="danger"
                            onClick={() => setIsEndModalOpen(true)}
                        >
                            End Session
                        </Button>
                        <Avatar
                            size="md"
                            isBordered as="button"
                            src={data?.user?.image || "https://placekitten.com/200/200"} />
                    </div>
                }
            </nav>

            <TopicModal
                isOpen={isTopicModalOpen}
                prompt={topicModalContent}
                onClose={() => setIsTopicModalOpen(false)}
                onSubmit={handleRefinePrompt}
            />

            <EndSessionModal
                isOpen={isEndModalOpen}
                onClose={() => setIsEndModalOpen(false)}
                onConfirm={handleEndSession}
            />
        </>
    );
}