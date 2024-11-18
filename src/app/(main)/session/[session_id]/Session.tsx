"use client"
import { Question } from './Question';
import { ScrollShadow } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { QuestionType } from '@prisma/client';
import { QuestionSkeleton } from './QuestionSkeleton';
import { motion } from 'framer-motion';

const questionVariants = {
    hidden: { 
        opacity: 0, 
        y: 20 
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.15,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

export const Session = () => {
    const params = useParams();
    const sessionId = params.session_id as string;
    
    const { data: questions, isLoading } = api.questions.getSessionQuestions.useQuery({
        sessionId,
    });

    return (
        <div className="h-full">
            <ScrollShadow className='max-w-3xl pb-10 flex flex-col gap-4 w-screen h-full' hideScrollBar>
                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <QuestionSkeleton key={i} />
                    ))
                ) : (
                    questions?.map((question, idx) => (
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
                                numbering={idx + 1}
                            />
                        </motion.div>
                    ))
                )}
            </ScrollShadow>
        </div>
    )
}