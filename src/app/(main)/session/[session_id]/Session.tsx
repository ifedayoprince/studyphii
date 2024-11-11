import DummyQuestions from '@/data/questions.json';
import { Question } from './Question';
import { ScrollShadow } from '@nextui-org/react';

export const Session = () => {
    return <div className="flex max-w-4xl flex-col items-center gap-5 h-screen overflow-x-hidden w-screen">
        <ScrollShadow className='py-10' hideScrollBar>
            {DummyQuestions.map((question, idx) => <>
                <Question key={idx} {...question} type={question.type as "multiple-choice" | "fill-in-the-blanks" | "subjective"} numbering={idx + 1} />
                <hr className="my-4 w-full border border-gray-700/20" />
            </>)}
        </ScrollShadow>
    </div>
}