"use client"

import { Button, ScrollShadow } from "@nextui-org/react"
import { Add, SidebarLeft } from "iconsax-react"
import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, isYesterday, differenceInDays } from "date-fns"

interface HistoryItem {
    name: string;
    slug: string;
    date: Date;
}

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const history: HistoryItem[] = [
        { name: "Thermodynamics", slug: "thermodynamics", date: new Date() },
        { name: "Quantum Physics", slug: "quantum-physics", date: new Date(Date.now() - 86400000) }, // yesterday
        { name: "Classical Mechanics", slug: "mechanics", date: new Date(Date.now() - 86400000 * 2) },
        { name: "Electromagnetism", slug: "em", date: new Date(Date.now() - 86400000 * 5) },
        { name: "Optics", slug: "optics", date: new Date(Date.now() - 86400000 * 12) },
        { name: "Nuclear Physics", slug: "nuclear", date: new Date(Date.now() - 86400000 * 20) },
        { name: "Fluid Dynamics", slug: "fluids", date: new Date(Date.now() - 86400000 * 35) },
    ]

    const groupHistoryByDate = (items: HistoryItem[]) => {
        const grouped: Record<string, HistoryItem[]> = {};

        items.forEach(item => {
            let groupKey: string;
            const daysDifference = differenceInDays(new Date(), item.date);

            if (isToday(item.date)) {
                groupKey = "Today";
            } else if (isYesterday(item.date)) {
                groupKey = "Yesterday";
            } else if (daysDifference <= 7) {
                groupKey = "Previous 7 days";
            } else if (daysDifference <= 30) {
                groupKey = "Previous 30 days";
            } else {
                groupKey = format(item.date, "MMMM yyyy");
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

                // If both are in groupOrder, sort by their index
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                // If only one is in groupOrder, it should come first
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;

                // For month strings, sort by date descending
                const dateA = new Date(keyA);
                const dateB = new Date(keyB);
                return dateB.getTime() - dateA.getTime();
            })
        );
    };

    const groupedHistory = groupHistoryByDate(history);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 left-0 z-50 h-screen w-[16rem] bg-background/80 backdrop-blur-md grid grid-rows-[max_content,auto]"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                            mass: 0.8
                        }}
                    >
                        <div className="flex flex-col gap-4 p-4 px-3 mb-6 border-b">
                            <div className="flex justify-end">
                                <Button isIconOnly variant="light" onClick={onClose}>
                                    <SidebarLeft variant="TwoTone" />
                                </Button>
                            </div>
                            <Button href="/session" startContent={<Add />} variant="bordered">New Session</Button>
                        </div>
                        <ScrollShadow className="flex flex-col gap-8 p-4 px-3 w-full h-full" hideScrollBar>
                            {Object.entries(groupedHistory).map(([groupName, items]) => (
                                <div key={groupName} className="flex flex-col gap-1">
                                    <p className="text-xs text-foreground-500 font-medium px-2">
                                        {groupName}
                                    </p>
                                    {items.map((item, index) => (
                                        <Button
                                            key={index}
                                            href={`/session/${item.slug}`}
                                            className="w-full justify-between group"
                                            variant="light"
                                            size="md"
                                        >
                                            {item.name}
                                            {/* <p className="text-foreground-500 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 -translate-y-2 text-sm">{format(item.date, "h:mm a")}</p> */}
                                        </Button>
                                    ))}
                                </div>
                            ))}
                        </ScrollShadow>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}