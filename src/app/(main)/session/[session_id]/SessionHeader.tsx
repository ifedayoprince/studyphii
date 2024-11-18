"use client";

import { Avatar, Button } from "@nextui-org/react"
import { useState } from "react";
import { TopicModal } from "./TopicModal";
import { EndSessionModal } from "./EndSessionModal";
import { useRouter } from "next/navigation";
import { SidebarRight } from "iconsax-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface SessionHeaderProps {
    onOpenSidebar: () => void;
    openSidebar: boolean;
    newSession?: boolean;
}

export const SessionHeader = ({ onOpenSidebar, openSidebar, newSession }: SessionHeaderProps) => {
    const { data } = useSession();
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const router = useRouter();

    const handleNewTopic = (topic: string) => {
        // TODO: Implement topic generation logic
        console.log("Generating questions for:", topic);
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
                        >
                            New Topic
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
                onClose={() => setIsTopicModalOpen(false)}
                onSubmit={handleNewTopic}
            />

            <EndSessionModal
                isOpen={isEndModalOpen}
                onClose={() => setIsEndModalOpen(false)}
                onConfirm={handleEndSession}
            />
        </>
    );
}