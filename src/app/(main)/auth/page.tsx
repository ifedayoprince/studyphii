"use client"
import { Button } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from 'next-auth/react'

export default function AuthPage() {
    return (
        <div className="flex w-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
            <div className="flex-1 flex flex-col items-center h-screen overflow-x-hidden">
                <Link href="/" className="absolute top-8 left-8 text-xl font-medium">
                    StudyPhii
                </Link>

                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="w-[90vw] md:w-[400px] bg-background/40 dark:bg-default-100/30 backdrop-blur-md p-4 sm:p-8">
                        <h1 className="text-3xl font-medium mb-8">Sign in</h1>
                        <Button
                            onClick={() => signIn("google", {callbackUrl: "/"})}
                            variant="shadow"
                            color="primary"
                            className="w-full"
                            startContent={<Image
                                src={"/svg/google.svg"}
                                className="w-5 h-5"
                                width={50}
                                height={50}
                                alt="Google logo"
                            />} >
                            Continue with Google
                        </Button>
                    </Card>
                </main>
            </div>
        </div>
    );
}