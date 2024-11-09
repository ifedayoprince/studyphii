"use client";

import { Button, ScrollShadow, Input } from "@nextui-org/react";
import { useResizable } from "react-resizable-layout";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

export interface SidebarItem {
    title: string;
    createdAt: Date;
}

interface GroupedItems {
    [key: string]: SidebarItem[];
}

function getItemGroup(date: Date): string {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return "This Week";
    if (isThisMonth(date)) return "This Month";
    return format(date, "MMMM yyyy");
}

function groupItemsByDate(items: SidebarItem[]): GroupedItems {
    return items.reduce((groups: GroupedItems, item) => {
        const group = getItemGroup(item.createdAt);
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
        return groups;
    }, {});
}

export function Sidebar() {
    const {
        isDragging,
        position,
        separatorProps
    } = useResizable({
        axis: "x",
        initial: 288, // 72px * 4
        min: 240,
        max: 480,
    });

    const items: SidebarItem[] = [
        { title: "History of the world", createdAt: new Date() },
        { title: "Ancient civilizations", createdAt: new Date(Date.now() - 86400000) }, // yesterday
        { title: "Ancient civilizations", createdAt: new Date(Date.now() - 86400000) }, // yesterday
        { title: "Ancient civilizations", createdAt: new Date(Date.now() - 86400000) }, // yesterday
        { title: "Ancient civilizations", createdAt: new Date(Date.now() - 86400000) }, // yesterday
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        { title: "Medieval times", createdAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
        // ... add more items with different dates
    ];

    const groupedItems = groupItemsByDate(items);

    return (
        <div className="flex h-full border border-r-1">
            <aside
                className="flex flex-col justify-between px-2 py-4"
                style={{ width: position }}>
                <div className="flex flex-col gap-1 w-full justify-between py-3 pb-7">
                    <p className="text-lg font-medium text-default-800">StudyPhii</p>
                    <Input
                        type="text"
                        placeholder="Search"
                        labelPlacement="outside"
                    //   startContent={
                    //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    //   }
                    />
                </div>

                <ScrollShadow className="w-full h-full" hideScrollBar>
                    <div className="flex flex-col gap-y-4">
                        {Object.entries(groupedItems).map(([group, items]) => (
                            <div key={group} className="flex flex-col">
                                <h3 className="text-sm font-medium text-default-600 px-3">
                                    {group}
                                </h3>
                                {items.map((item, i) => (
                                    <Button
                                        key={i}
                                        className="justify-start group"
                                        variant="light"
                                        title={item.title}
                                    >
                                        <span className="truncate">{item.title}</span>
                                        <span className="hidden opacity-0 group-hover:opacity-100 transition-all group-hover:inline-block text-xs text-default-400 ml-auto">
                                            {format(item.createdAt, "h:mm a")}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </div>
                </ScrollShadow>
            </aside>
            <div
                {...separatorProps}
                className={`w-1 cursor-col-resize hover:bg-default-200 active:bg-primary transition-colors ${isDragging ? "bg-primary/50" : ""
                    }`}
            />
        </div>
    );
} 