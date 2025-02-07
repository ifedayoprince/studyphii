"use client"

import { Button } from "@nextui-org/react";
import { AddCircle } from "iconsax-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

export default function Congratulations() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex w-screen h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
            <ReactConfetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={200}
                recycle={false}
                colors={['#818cf8', '#c084fc', '#ff7f50', '#ff4500', '#34d399']}
            />
            <div className="m-auto text-center gap-y-10 px-4 flex flex-col w-full items-center">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Weapon Unlocked ⚔️🎉
                </h1>

                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    You now have full access to our AI-powered study platform. Let's start your learning journey!
                </p>
                <div className="relative group">
                    <div className="absolute -inset-3 blur-3xl bg-gradient-to-r from-color1 via-color2 to-color3 rounded-lg opacity-100 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl group-hover:-inset-1 animate-gradient-xy"></div>
                    <Link href="/session">
                        <Button
                            className="relative py-7 hover:scale-110 bg-color2 items-center font-semibold px-5">
                            <AddCircle />
                            Create Session
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 