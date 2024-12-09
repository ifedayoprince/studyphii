"use client"
import { Question } from './Question';
import { ScrollShadow, Button } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { QuestionType } from '@prisma/client';
import { QuestionSkeleton } from './QuestionSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useGlobalStore } from './globalStore';

const questionVariants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.05,
            duration: 0.3,
            ease: "easeIn"
        }
    })
};

export const Session = () => {
    const params = useParams();
    const sessionId = params.session_id as string;

    const { data: output, isLoading, refetch } = api.questions.getSessionQuestions.useQuery({ sessionId });

    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateMore, setShowGenerateMore] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { setRefinePrompt, setSessionQuestionsRefresher } = useGlobalStore();

    const generateQuestions = api.questions.generateMoreQuestions.useMutation({
        onSuccess: () => {
            refetch();
        }
    });

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        // Show button when user has scrolled past 80% of content
        setShowGenerateMore(scrollPercentage > 0.8);
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);
    useEffect(() => {
        if (!output) return;

        console.log(output)
        if (output.refinePrompt) {
            setRefinePrompt(output.refinePrompt);
        }
        setSessionQuestionsRefresher(async () => { await refetch() });
    }, [output])

    const handleGenerateMore = async () => {
        setIsGenerating(true);
        try {
            await generateQuestions.mutateAsync({ sessionId });
            await refetch();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center relative">
            <ScrollShadow
                ref={scrollRef}
                className='max-w-3xl pb-20 flex flex-col gap-4 w-screen flex-grow'
                hideScrollBar
            >
                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <QuestionSkeleton key={i} />
                    ))
                ) : (
                    output?.questions?.map((question, idx) => (
                        <motion.div
                            key={question.id}
                            variants={questionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={idx}
                        >
                            <Question
                                {...question}
                                sessionId={sessionId}
                                refreshQuestions={async () => { await refetch() }}
                                numbering={idx + 1}
                            />
                        </motion.div>
                    ))
                )}
            </ScrollShadow>

            <AnimatePresence>
                {showGenerateMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 w-full flex justify-center -translate-x-1/2 z-10 mx-auto"
                    >
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={handleGenerateMore}
                            isLoading={isGenerating}
                            className="px-8 backdrop-blur-lg"
                        >
                            Load More
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}