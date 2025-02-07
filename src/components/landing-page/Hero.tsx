"use client";
import React from 'react';
import { CloseCircle, Gift, MedalStar, Message, Star, Star1 } from 'iconsax-react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Logo } from '../logo';
import { QuestionsAnimation } from './QuestionsAnimation';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="w-full h-max relative bg-background mb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:grid grid-cols-10 justify-center gap-16 lg:gap-20 px-8 py-8 lg:pb-16 h-auto pt-48 relative z-10" id='hero'>
        <div className="col-span-6 flex flex-col gap-10 justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl text-center md:text-start md:text-6xl leading-tight font-extrabold tracking-tight md:mb-1"
          >
            Master your courses<br />
            in hours,
            <span className='hidden md:inline'>&nbsp;&nbsp;</span>
            <span className="relative w-fit inline-block md:inline">
              <span className={'bg-color3 absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1'}></span>
              <span className={'relative text-foreground-opposite'}>not days</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-center md:text-start text-gray-400 font-medium leading-relaxed"
          >
            StudyPhii generates personalized practice questions for your study session to help you learn more without spending 6+ hours at the desk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='space-y-4 mt-3 md:mt-0 w-full flex flex-col items-center md:items-start'
          >
            <div className="relative w-full md:w-2/4 group">
              <div className="absolute -inset-3 blur-3xl bg-gradient-to-r from-color1 via-color2 to-color3 rounded-lg opacity-100 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl group-hover:-inset-1 animate-gradient-xy"></div>
              <Link href="#bonus">
                <Button
                  className="relative w-full py-7 hover:scale-110 bg-color2 items-center font-semibold">
                  <Logo />
                  Try for $0.99
                </Button>
              </Link>
            </div>
            <p className='text-xs flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 md:gap-y-0 md:gap-x-[6px] md:text-xs w-full text-gray-400'>
              <span className="flex items-center gap-2 w-max">
                <MedalStar className='w-3 h-3' variant='Bold' />
                Satisfaction Guaranteed
                <span className="hidden md:inline">&nbsp;|&nbsp;</span>
              </span>
              <span className="flex items-center gap-2 w-max">
                <CloseCircle className='w-3 h-3' variant='Bold' />
                Cancel Anytime
                <span className="hidden md:inline">&nbsp;|&nbsp;</span>
              </span>
              <span className="flex items-center gap-2 w-max">
                <Message className='w-3 h-3' variant='Bold' />
                24/7 Customer Support
              </span>
            </p>
            <p className='text-sm items-start gap-2 md:text-sm w-full text-gray-300 hidden'>
              <Gift color="#55cc00" size={20} />
              <span>
                <span className='text-lime-500 text-sm'>
                  30% off
                </span>
                &nbsp;for the next 100 customers (few slots left)
              </span>
            </p>
          </motion.div>
        </div>
        <div className="h-full w-full col-span-4 min-h-max">
          <QuestionsAnimation />
        </div>
      </div>
    </div>
  );
};

export default Hero;