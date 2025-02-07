"use client"
import React from 'react';
import FooterConfig from './config/footer/footer.json';

const Footer: React.FC = () => {
    const { sections } = FooterConfig;

    return (
        <footer className='bg-background-primary border-t border-border-color-primary/65' id='footer'>
            <div className='max-w-7xl mx-auto px-8 py-24'>
                <div className='flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col'>
                    <div className='w-80 max-w-full flex-shrink-0 md:mx-0 mx-auto text-center md:text-left'>
                        <a href="/" className='flex gap-2 justify-center md:justify-start items-center text-primary-color'>
                            <h1 className='text-foreground-hsl text-xl font-bold'>StudyPhii</h1>
                        </a>
                        <p className="mt-3 text-sm text-foreground-hsl/70 leading-relaxed">
                            Copyright© 2025 All rights reserved
                        </p>
                    </div>
                    <div className='flex-grow flex flex-wrap md:pl-24 -mb-10 md:mt-0 mt-10 text-center md:text-left'>
                        {sections.map((section, index) => (
                            <div key={index} className='lg:w-1/3 md:w-1/2 w-full px-4'>
                                <div className="font-semibold text-gray-400 tracking-widest text-sm md:text-left mb-3">{section.title}</div>
                                <div className='flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm'>
                                    {section.links.map((link, linkIndex) => (
                                        <a key={linkIndex} className="hover:underline" href={link.href}>{link.text}</a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;