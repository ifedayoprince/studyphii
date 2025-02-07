"use client"
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Link } from '@nextui-org/react';
import { Logo } from '../logo';


const CTA: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    return (
        <motion.section
            ref={targetRef}
            className='bg-background-secondary pt-7'
            id='cta'>
            <div
                className='bg-background-secondary pb-24 pt-24 px-8 w-full mx-auto flex flex-col items-center gap-8 md:gap-12'>
                <div className='text-center'>
                    <h2 className="relative font-bold text-3xl md:text-5xl tracking-tight mt-4 mb-4 md:mb-8 ">Learn More While Studying<br />
                        <span className='relative whitespace-nowrap ml-4'>
                            <span className={'bg-color3 absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1'}
                            ></span>
                            <span className={'relative text-foreground-opposite'}
                            >10x Less</span>
                        </span></h2>
                    <p className="relative text-lg text-base-content/80">Don't spend 6+ hours learning just one topic anymore. Use StudyPhii and get done faster.</p>
                </div>
                <div className='relative w-3/4 md:w-2/4 xl:max-w-lg flex items-center'>
                    <div className="absolute -inset-3 blur-3xl bg-gradient-to-r from-color1 via-color2 to-color3 rounded-lg opacity-100 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl group-hover:-inset-1 animate-gradient-xy"></div>
                    <Link href="/auth" className='w-full'>
                        <Button
                            className="relative w-full py-7 hover:scale-110 bg-color2 items-center font-semibold">
                            <Logo />
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.section>
    );
};

export default CTA;