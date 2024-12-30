"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Label from './Label';
import { Book1, Teacher, Timer1, MessageQuestion } from 'iconsax-react';



const ProblemsComponents: React.FC = () => {

    return (
        <section className='relative bg-card text-neutral-content rounded-xl p-2 md:p-12 max-w-xs md:max-w-3xl mx-auto text-center text-lg mt-24 md:mt-0' id='problems'>
            <div className='flex flex-col text-center w-full mb-10'>
                <Label text={"Problem"} />
                <h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-2 max-w-2xl mx-auto">Studying is hard 😥!</h2>
            </div>
            <div className='leading-relaxed space-y-4 md:space-y-6'>
                <div className="text-neutral-content/80 space-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex flex-row bg-cards-bg-secondary p-4 rounded-lg gap-5 cursor-pointer">
                            <div className='flex align-middle items-center'>
                                <Book1 />
                            </div>
                            <div className='items-start text-start'>
                                <p className='font-light text-sm items-start'>Endless notes and textbooks make it hard to focus on what actually matters.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex flex-row bg-cards-bg-secondary p-4 rounded-lg gap-5 cursor-pointer">
                            <div className='flex align-middle items-center'>
                                <Teacher />
                            </div>
                            <div className='items-start text-start'>
                                <p className='font-light text-sm items-start'>You want to study smarter but don't know where to begin.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex flex-row bg-cards-bg-secondary p-4 rounded-lg gap-5 cursor-pointer">
                            <div className='flex align-middle items-center'>
                                <MessageQuestion />
                            </div>
                            <div className='items-start text-start'>
                                <p className='font-light text-sm items-start'>Traditional study methods have proven ineffective and frustrating to use.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex flex-row bg-cards-bg-secondary p-4 rounded-lg gap-5 cursor-pointer">
                            <div className='flex align-middle items-center'>
                                <Timer1 />
                            </div>
                            <div className='items-start text-start'>
                                <p className='font-light text-sm items-start'>Cramming seems effective, but everything fades away by the next day.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center text-gray-400 text-sm mt-14 mb-20">
                ↓ There's an easier way
            </div>
        </section>
    );
};

export default ProblemsComponents;