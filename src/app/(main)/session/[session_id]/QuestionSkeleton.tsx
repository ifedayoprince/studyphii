import { Skeleton } from "@nextui-org/react";

export const QuestionSkeleton = () => {
    return (
        <div className="w-full p-10 py-3 rounded-xl group flex gap-8">
            <Skeleton className="rounded-full h-8 w-8 bg-black/20 dark:bg-black/60 dark:opacity-60">
                <div className="h-8 w-8" />
            </Skeleton>
            <div className="flex flex-col gap-4 w-full">
                <Skeleton className="rounded-lg bg-black/20 dark:bg-black/60 dark:opacity-60">
                    <div className="h-7 w-3/4" />
                </Skeleton>
                <div className="flex flex-col gap-2">
                        <Skeleton className="rounded-lg w-3/5 bg-black/20 dark:bg-black/60 dark:opacity-60">
                            <div className="h-6 w-1/2" />
                        </Skeleton>
                        <Skeleton className="rounded-lg w-4/6 bg-black/20 dark:bg-black/60 dark:opacity-60">
                            <div className="h-6 w-1/2" />
                        </Skeleton>
                </div>
            </div>
        </div>
    );
};
