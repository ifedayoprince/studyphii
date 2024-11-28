"use client";

import { Avatar, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tabs, Tab } from "@nextui-org/react"
import { useState, useEffect } from "react";
import { RefineModal } from "./RefineModal";
import { EndSessionModal } from "./EndSessionModal";
import { useRouter } from "next/navigation";
import { SidebarRight, Moon, Sun, Mobile } from "iconsax-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalStore } from './globalStore';
import { useTheme } from "next-themes";

interface SessionHeaderProps {
    onOpenSidebar: () => void;
    openSidebar: boolean;
    newSession?: boolean;
}

export const SessionHeader = ({ onOpenSidebar, openSidebar, newSession }: SessionHeaderProps) => {
    const { data } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const sessionId = params.session_id as string;
    const [isGenerating, setIsGenerating] = useState(false);
    const { refinePrompt, sessionQuestionsRefresher } = useGlobalStore();
    const more = api.questions.generateMoreQuestions.useMutation();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleRefinePrompt = async (topic: string) => {
        setIsGenerating(true);
        try {
            await more.mutateAsync({
                sessionId,
                refinePrompt: topic
            });
            sessionQuestionsRefresher();
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
                    ? <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                size="md"
                                isBordered
                                as="button"
                                src={data?.user?.image || "https://placekitten.com/200/200"}
                                className="transition-transform" />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">{data?.user?.name}</p>
                                <p className="font-normal text-sm text-default-500">{data?.user?.email}</p>
                            </DropdownItem>
                            <DropdownItem
                                key="theme"
                                className="cursor-default"
                                as="li"
                                closeOnSelect={false}
                            >
                                <div className="w-full py-1">
                                    <Tabs
                                        aria-label="Theme options"
                                        selectedKey={theme || "system"}
                                        onSelectionChange={(key) => setTheme(key as string)}
                                        size="sm"
                                        color="primary"
                                        variant="light"
                                        classNames={{
                                            tabList: "gap-2 w-full justify-between py-0",
                                            base: "w-full",
                                            cursor: "w-full",
                                            tab: "px-2 h-8",
                                        }}
                                    >
                                        <Tab
                                            key="light"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Sun size={16} />
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="dark"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Moon size={16} />
                                                </div>
                                            }
                                        />
                                        <Tab
                                            key="system"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Mobile size={16} />
                                                </div>
                                            }
                                        />
                                    </Tabs>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
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
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    size="md"
                                    isBordered
                                    as="button"
                                    src={data?.user?.image || "https://placekitten.com/200/200"}
                                    className="transition-transform" />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">{data?.user?.name}</p>
                                    <p className="font-normal text-sm text-default-500">{data?.user?.email}</p>
                                </DropdownItem>
                                <DropdownItem
                                    key="theme"
                                    className="cursor-default"
                                    as="li"
                                    closeOnSelect={false}
                                >
                                    <div className="w-full py-1">
                                        <Tabs
                                            aria-label="Theme options"
                                            selectedKey={theme || "system"}
                                            onSelectionChange={(key) => setTheme(key as string)}
                                            size="sm"
                                            color="primary"
                                            variant="light"
                                            classNames={{
                                                tabList: "gap-2 w-full justify-between py-0",
                                                base: "w-full",
                                                cursor: "w-full",
                                                tab: "px-2 h-8",
                                            }}
                                        >
                                            <Tab
                                                key="light"
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <Sun size={16} />
                                                    </div>
                                                }
                                            />
                                            <Tab
                                                key="dark"
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <Moon size={16} />
                                                    </div>
                                                }
                                            />
                                            <Tab
                                                key="system"
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <Mobile size={16} />
                                                    </div>
                                                }
                                            />
                                        </Tabs>
                                    </div>
                                </DropdownItem>
                                <DropdownItem key="settings">Settings</DropdownItem>
                                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                                <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                }
            </nav>

            <RefineModal
                isOpen={isTopicModalOpen}
                onClose={() => setIsTopicModalOpen(false)}
                onSubmit={handleRefinePrompt}
                prompt={refinePrompt}
            />

            <EndSessionModal
                isOpen={isEndModalOpen}
                onClose={() => setIsEndModalOpen(false)}
                onConfirm={handleEndSession}
            />
        </>
    );
}