"use client"
import { ScrollShadow } from "@nextui-org/react";
import { Question as IQuestion, QuestionType } from "@prisma/client";
import { Question } from "@/app/(main)/session/[session_id]/Question";
import { SessionHeader } from "@/app/(main)/session/[session_id]/SessionHeader";
import { Sidebar } from "@/app/(main)/session/Sidebar";


const sessionId = "1234567";
const questions: Partial<IQuestion>[] = [{
    content: 'Which of the following philosophers developed the concept of "categorical imperative"?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Aristotle", "Kant", "Nietzsche", "Descartes_"],
    id: "1234567",
    sessionId
}];
export default function MockSessionPage() {
    return <div className="flex w-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
        <Sidebar isOpen={false} onClose={() => { }} />
        <main className="grid grid-rows-[min-content,auto] items-center w-full h-screen overflow-x-hidden relative">
            <SessionHeader newSession={false} mock onOpenSidebar={() => { }} openSidebar={false} />
            <div className="h-full w-full max-h-full overflow-y-hidden px-5 md:px-0">
                <div className="w-full flex justify-center h-full">
                    <div className="h-full flex flex-col items-center relative">
                        <ScrollShadow
                            className='max-w-3xl pb-20 flex flex-col gap-4 w-screen flex-grow'
                            hideScrollBar
                        >
                            {questions?.map((question, idx) => (
                                <Question
                                    hasDiscussion={false}
                                    {...question}
                                    sessionId={sessionId}
                                    refreshQuestions={async () => { }}
                                    numbering={idx + 1}
                                />
                            ))}
                        </ScrollShadow>
                    </div>
                </div>
            </div>
        </main>
    </div>
}
