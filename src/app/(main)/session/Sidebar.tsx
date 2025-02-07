"use client"

import { Button, ScrollShadow, Tooltip } from "@nextui-org/react"
import { Add, SidebarLeft, Book1 } from "iconsax-react"
import { motion } from "framer-motion"
import { format, isToday, isYesterday, differenceInDays } from "date-fns"
import Link from "next/link"
import { api } from "@/trpc/react"
import { Spinner } from "@nextui-org/react"


interface HistoryItem {
    id: string;
    title: string;
    topic: string;
    createdAt: Date;
    lastActiveAt: Date | null;
}

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { data: history, isLoading } = api.session.getHistory.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    const groupHistoryByDate = (items: HistoryItem[]) => {
        const grouped: Record<string, HistoryItem[]> = {};

        items?.forEach(item => {
            let groupKey: string;
            const date = item.lastActiveAt ?? item.createdAt;
            const daysDifference = differenceInDays(new Date(), date);

            if (isToday(date)) {
                groupKey = "Today";
            } else if (isYesterday(date)) {
                groupKey = "Yesterday";
            } else if (daysDifference <= 7) {
                groupKey = "Previous 7 days";
            } else if (daysDifference <= 30) {
                groupKey = "Previous 30 days";
            } else {
                groupKey = format(date, "MMMM yyyy");
            }

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey]!.push(item);
        });

        // Sort the groups by date
        const groupOrder = [
            "Today",
            "Yesterday",
            "Previous 7 days",
            "Previous 30 days"
        ];

        return Object.fromEntries(
            Object.entries(grouped).sort(([keyA], [keyB]) => {
                const indexA = groupOrder.indexOf(keyA);
                const indexB = groupOrder.indexOf(keyB);

                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;

                const dateA = new Date(keyA);
                const dateB = new Date(keyB);
                return dateB.getTime() - dateA.getTime();
            })
        );
    };

    const groupedHistory = history ? groupHistoryByDate(history) : {};
    const hasNoSessions = history && history.length === 0;

    return (
        <div>
            <div className={`fixed z-30 h-screen w-screen overflow-hidden ${isOpen ? 'block' : 'hidden'} md:!hidden`} onClick={onClose}></div>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: isOpen ? "16rem" : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed z-50 md:sticky grid grid-rows-[max-content,auto] h-screen overflow-hidden border-r border-gray-500/10 bg-black/10 backdrop-blur-xl md:backdrop-blur-none md:bg-transparent"
            >
                <div className="flex flex-col gap-4 p-4 px-3 mb-6">
                    <div className="flex justify-start">
                        <Button isIconOnly variant="light" onClick={onClose}>
                            <SidebarLeft variant="TwoTone" />
                        </Button>
                    </div>
                    <Link href="/session" className="w-full" prefetch>
                        <Button className="w-full border-gray-300 dark:border-default" startContent={<Add />} variant="bordered">
                            New Session
                        </Button>
                    </Link>
                </div>
                <ScrollShadow className="flex flex-col gap-8 p-4 px-3 w-full h-full" hideScrollBar>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner />
                        </div>
                    ) : hasNoSessions ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                            <Book1
                                size={32}
                                variant="Bulk"
                                className="text-foreground-400"
                            />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground-600">
                                    No sessions yet
                                </p>
                                <p className="text-xs text-foreground-400">
                                    Start a new session to begin learning
                                </p>
                            </div>
                        </div>
                    ) : (
                        Object.entries(groupedHistory).map(([groupName, items]) => (
                            <div key={groupName} className="flex flex-col gap-1">
                                <p className="text-xs text-foreground-500 font-medium px-2">
                                    {groupName}
                                </p>
                                {items.map((item) => <SessionButton key={item.id} id={item.id} title={item.title} />)}
                            </div>
                        ))
                    )}
                </ScrollShadow>
            </motion.div>
        </div>
    )
}

const SessionButton = ({ id, title }: { id: string, title: string }) => {
    const utils = api.useUtils();

    return <Link
        href={`/session/${id}`}
        key={id}
        className="w-full"
        onMouseEnter={async () => await utils.questions.getSessionQuestions.prefetch({ sessionId: id })}>
        <Tooltip
            content={title}
            delay={1500}
            closeDelay={0}
        >
            <Button
                className="w-full justify-between group"
                variant="light"
                size="md">
                <span className="truncate">{title}</span>
            </Button>
        </Tooltip>
    </Link>
}