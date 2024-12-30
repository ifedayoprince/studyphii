"use client"
import React from 'react';
import { motion } from 'framer-motion';
import featuredInConfig from './config/Featured/featured.json';


const FeaturedIn: React.FC = () => {
    const { logos } = featuredInConfig;

    return (
        <section className='bg-background w-full p-8 md:p-10 flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8 mb-6' id='featuredIn'>
            <span className="opacity-60 mb-4 md:mb-0 text-sm">Featured on</span>
            <div className='flex flex-row gap-4 md:gap-5  h-10 md:h-40 items-center align-middle'>
                {logos.map((logo, index) => (
                    <motion.a
                        key={index}
                        href={logo.link}
                        title={`featured in ${logo.title}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="featured-logo flex flex-col items-center gap-2 group"
                    >
                        <img
                            src={logo.src}
                            width={30}
                            height={30}
                            alt={logo.alt}
                            title={logo.title}
                            className="w-10 h-10 transition-all duration-300 opacity-60"
                        />
                    </motion.a>
                ))}
            </div>

            {/* <span className="logo-title text-xs font-thin">Product Hunt</span> */}
        </section>
    );
};

export default FeaturedIn;