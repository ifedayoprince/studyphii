"use client"
import React, { useEffect, useState } from 'react';
import siteConfig from './config/siteConfig.json';
import { ArrowUp2, ArrowDown2 } from 'iconsax-react';
import { motion } from 'framer-motion';
import FaqConfig from './config/FAQ/faq.json';

const YoutubeVideo = () => {
    return (
        <div className='flex flex-col mb-24 w-full items-center justify-center'>
            <iframe
                width="560"
                height="315"
                src="https://youtube.com/embed/DK_I5fJuVss"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg w-[90%] md:w-[85%] aspect-video max-w-3xl h-auto"
            ></iframe>
        </div>
    );
}
const FAQ: React.FC = () => {
    const { questions } = FaqConfig;
    const [expanded, setExpanded] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpanded(expanded === index ? null : index);
    };

    
    return (
        <section className='bg-background-secondary pt-16 w-full space-y-10' id='faq'>
            <YoutubeVideo />
        <div className='flex flex-col overflow-hidden align-middle items-center max-w-sm py-11 px-10 md:py-24 md:px-24 md:max-w-5xl mx-auto rounded-3xl border border-elements-secondary'>
            <div className='flex flex-col text-center basis-1/2'>
                <p className='sm:text-4xl text-3xl font-extrabold mb-8'>
                    Frequently Asked Questions
                </p>
                <div className='font-normal'>
                    Have another question? Contact me on <a href="https://x.com/ifedayoprince_">X (Twitter)</a> or by <a href="mailto:dev@phii.space">email</a>
                </div>
            </div>
            <div className='w-full'>
            <ul className='mt-9'>
                {questions.map((item, index) => (
                    <li key={index} className='w-full'>
                        <button
                            className='relative flex gap-2 justify-between items-center w-full py-5 px-4 text-base font-semibold text-left border-t border-t-elements-secondary md:text-lg'
                            onClick={() => toggleExpand(index)}
                        >
                            {item.question}
                            {expanded === index ? <ArrowUp2 /> : <ArrowDown2 />}
                        </button>
                        {expanded === index && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                className='overflow-hidden'
                            >
                                <p className='py-2 px-4'>{item.answer}</p>
                            </motion.div>
                        )}
                    </li>
                ))}
            </ul>
            </div>
            
        </div>
    </section>
);
};

export default FAQ;