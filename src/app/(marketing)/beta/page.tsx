"use client"

import { Button } from "@nextui-org/react";
import { ArrowLeft } from "iconsax-react";
import Link from "next/link";

export default function Beta() {
    return (
        <div className="flex w-screen h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
            <div className="m-auto text-center space-y-10 px-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Beta Testing
                </h1>

                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    If you're one of our beta testers, you can sign in. Otherwise, stay tuned for public access coming soon!
                </p>
                <Link href="/auth">
                    <Button
                        variant="shadow"
                        color="secondary"
                        startContent={<ArrowLeft size={20} />}
                        className="mt-8"
                    >
                        Go Back
                    </Button>
                </Link>
                <p className="text-gray-600 dark:text-gray-400">
                    Follow us on <a href="https://instagram.com/studyphii_" className="text-blue-500">Instagram</a> to know when we are live!
                </p>
            </div>
        </div>
    )
} 