"use client";
import React from 'react';
import { Gift } from 'iconsax-react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useScrollScale } from '@/hooks/useScrollScale';
import { useVideoIntersection } from '@/hooks/useVideoIntersection';

const Hero: React.FC = () => {
    const scale = useScrollScale(0.8, 1.1);
    const { videoRef, isInView } = useVideoIntersection(0.7);
    
    return (
        <div className="w-full h-max relative">
            <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 animated-gradient"
                />
                <div 
                    className="absolute bottom-0 left-0 right-0 h-64" 
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgb(0,0,0) 100%)'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:pb-16 h-auto pt-48 relative z-10" id='hero'>
                <div className="flex flex-col gap-10 items-center justify-center text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-extrabold lg:text-6xl tracking-tight md:mb-1 flex flex-col gap-3 items-center text-center"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Generate practice questions for
                        </motion.span>
                        <span className="relative inline-block">
                            <span className="relative whitespace-nowrap">
                                your
                            </span>
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className='relative whitespace-nowrap ml-4'
                            >
                                <span className={'bg-color3 absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1'}></span>
                                <span className={'relative text-foreground-opposite'}>study session</span>
                            </motion.span>
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-lg text-foreground-hsl/85 font-medium leading-relaxed"
                    >
                        Easily understand complex topics, concepts and more without spending 6+ hours at the desk.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className='space-y-4 w-2/4'
                    >
                        <Button 
                            href="/auth" 
                            className="w-full py-7 hover:scale-110 bg-color2 shadow-xl shadow-white/30 transition-transform duration-300"
                        >
                            Get Started
                        </Button>
                        <p className='text-sm justify-center items-center gap-2 md:text-sm hidden'>
                            <Gift color="#55cc00" size={20} />
                            <span>
                                <span className='text-lime-500 text-sm'>
                                    BONUS
                                </span>
                            </span>
                            30% off for the next 48 hours
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ scale }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl relative"
                >
                    <video
                        ref={videoRef}
                        className="w-full aspect-video object-cover rounded-xl"
                        playsInline
                        loop
                        muted
                        preload="auto"
                        poster="/hero-image.png"
                    >
                        <source src="/assets/hero-video.webm" type="video/webm" />
                        <source src="/assets/hero-video.mp4" type="video/mp4" />
                    </video>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isInView ? 0 : 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                <svg 
                                    className="w-6 h-6 text-black" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        fill="currentColor" 
                                        d="M8 5v14l11-7z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;