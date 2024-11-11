"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
// import mockTeaser from '@/server/data/mock-teaser.json'
import XIcon from '../x.svg'
import Image from 'next/image'

export default function StudyGuideGenerator() {
  return (<div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <header className="w-full p-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-indigo-600">StudyPhii</h2>
      <Link href="https://x.com/ifedayoprince_" target="_blank" rel="noopener noreferrer">
        <Image src={XIcon} alt="X" width={24} height={24} />
      </Link>
    </header>

    <main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start space-y-12 lg:space-y-0 lg:space-x-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 space-y-8"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-center lg:text-left leading-tight">
            Level up your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">study game</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center lg:text-left">
            Transform your boring course outline into a lit study guide with curated YouTube vids and comprehension questions. #StudySmarter
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/2 w-full"
        >
          <Card className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-indigo-100">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <label htmlFor="outline" className="block text-lg font-medium text-gray-700 mb-2">Drop your course outline 📚</label>
                <Textarea
                  id="outline"
                  placeholder="Paste that syllabus here..."
                  className="min-h-[150px] w-full text-lg rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                  'Generate Study Guide 🚀'
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
    <footer className="w-full p-6 text-center text-gray-600">
      <p>© 2024 StudyPhii. Made with 💜 by Ifedayo</p>
    </footer>
  </div>
  )
}
