"use client"
import Link from 'next/link'
import { Button } from '@nextui-org/react';


export default function LandingPage() {

  return (<div className="w-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
    <div className=" min-h-screen w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            StudyPhii
          </Link>
        </div>
        <div>
          <Link href="/auth">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
      <main className="pt-20 w-full flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4 items-center justify-center text-center max-w-4xl mt-24">
          <h1 className="text-6xl [line-height:1.25] text-center font-bold">Generate practice questions for your study session</h1>
          <h4 className="text-xl text-center mt-6 mb-4">Easily understand topics, concepts and more with AI-generated questions;<br/>All without spending 6+ hrs at the desk.</h4>
          <div className='w-max'>
            <Button size="lg" className="rounded-3xl py-8 mt-10 w-full px-20 hover:scale-110 transition-all duration-400 bg-[#581c87]  hover:shadow-2xl hover:shadow-white/50">
              Study 10x Faster
            </Button>
            <p className='px-16 mt-2'>Fixed cost. No hidden fees.</p>
          </div>
        </div>

      </main>
    </div>
    <div className="w-4/6 mt-24 relative rounded-3xl hover:scale-110 transition-all duration-400 aspect-video bg-gray-300">

    </div>
  </div>
  )
}
