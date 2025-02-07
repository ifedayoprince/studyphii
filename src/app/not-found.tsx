"use client"

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "iconsax-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex w-screen h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
      <div className="m-auto text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>
        <Button
          variant="shadow"
          color="secondary"
          startContent={<ArrowLeft size={20} />}
          onClick={() => router.back()}
          className="mt-8"
        >
          Go Back
        </Button>
      </div>
    </div>
  )
} 