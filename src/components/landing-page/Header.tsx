"use client";
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { Logo } from '../logo';

const Header: React.FC = () => {
  return (
    <header className="fixed w-full mx-auto px-8 py-5 flex items-center justify-between md:py-6 top-0 bg-gradient-to-b from-black from-20% to-transparent z-50" id='Navbar'>
      <div className="flex flex-row items-center align-middle gap-1 md:w-40 ">
        <h1 className="text-logo-text-color text-xl font-semibold flex gap-2 items-center">
          <Logo />
          StudyPhii
        </h1>
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