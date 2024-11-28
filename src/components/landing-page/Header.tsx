"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'iconsax-react';
// import NavPopup from './atoms/NavPopup';
import navbarConfig from './config/navbar/navbar.json';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const themeLinkRef = useRef<HTMLAnchorElement>(null);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // const { logo, brand } = siteConfig;
  const { cta, mobileMenu } = navbarConfig;


  return (
    <header className="fixed w-full mx-auto px-8 py-5 flex items-center justify-between md:py-6 top-0 bg-gradient-to-b from-black from-20% to-transparent z-50" id='Navbar'>
      <div className="flex flex-row items-center align-middle gap-1 md:w-40 ">
        {/* <motion.img src={logo} alt={`${brand} Logo`} fetchPriority='high' className='w-8 h-8 text-logo-text-color'
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            /> */}
        <h1 className="text-logo-text-color text-xl font-semibold">StudyPhii</h1>
      </div>
      <nav className="flex items-center pl-12 md:pl-20 gap-4 md:gap-4">
        <div className="flex items-center md:flex-row md:gap-3 ">
          <Link href="/auth" prefetch>
            <Button className="px-6 bg-color2" size="lg" >Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;