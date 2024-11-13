"use client";

import { Avatar, Button } from "@nextui-org/react"
import { useState } from "react";
import { TopicModal } from "./TopicModal";
import { EndSessionModal } from "./EndSessionModal";
import { useRouter } from "next/navigation";

export const SessionHeader = () => {
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const router = useRouter();

    const handleNewTopic = (topic: string) => {
        // TODO: Implement topic generation logic
        console.log("Generating questions for:", topic);
    };

    const handleEndSession = () => {
        // TODO: Implement session end logic
        router.push("/dashboard");
    };

    return (
        <>
            <nav className="flex items-center justify-between py-4 px-10 fixed z-10 backdrop-blur-md w-full">
                <h2 className="text-xl font-medium">
                    StudyPhii
                </h2>
                <div className="flex gap-3">
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
                    src="https://i.pravatar.cc/150?img=64" />
                </div>
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