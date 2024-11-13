"use client"
import DummyQuestions from '@/data/questions.json';
import { Question } from './Question';
import { Button, ScrollShadow } from '@nextui-org/react';
import { SessionHeader } from './SessionHeader';
import { SessionFooter } from './SessionFooter';
import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { SidebarLeft, SidebarRight } from 'iconsax-react';

export const Session = () => {
    const [openSidebar, setOpenSidebar] = useState(false);

    return <div className="flex w-screen">
        <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
        <div className="flex flex-col items-center gap-5 h-screen overflow-x-hidden w-full">
            <Button isIconOnly variant="light" onClick={() => setOpenSidebar(true)} className="fixed top-24 left-4">
                <SidebarRight variant='TwoTone' />
            </Button>
            <SessionHeader />
            <ScrollShadow className='max-w-3xl pb-10 flex flex-col gap-4 w-full mt-20' hideScrollBar>
                {DummyQuestions.map((question, idx) => <>
                    <Question key={idx} {...question} type={question.type as "multiple-choice" | "fill-in-the-blanks" | "subjective"} numbering={idx + 1} />
                    {/* <hr className="my-4 w-full border border-gray-700/20" /> */}
                </>)}
            </ScrollShadow>
            {/* <SessionFooter /> */}
        </div>
    </div>
}