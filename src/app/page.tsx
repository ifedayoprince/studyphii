"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Twitter, Download } from 'lucide-react'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { downloadPDF } from './utils/pdf'

interface StudyGuideTopic {
  name: string;
  overview: string;
  learningObjective: string;
  videos: string[];
}

interface StudyGuide {
  topics: StudyGuideTopic[];
}

export default function StudyGuideGenerator() {
  const [courseOutline, setCourseOutline] = useState('')
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [email, setEmail] = useState('')

  const generateMutation = api.studyGuide.generateStudyGuide.useMutation({
    onSuccess: (data) => {
      // setStudyGuide({
      //   topics: data.topics.map(topic => ({
      //     ...topic,
      //     videos: [] // We'll fetch videos in a separate step
      //   }))
      // })
    },
    onError: (error) => {
      console.error("Error generating study guide:", error)
      // Handle error (e.g., show an error message to the user)
    }
  })
  const pdfMutation = api.pdf.generatePDF.useMutation({
    onSuccess: (data)=>{
      downloadPDF(data as any)
    }
  })

  const generateStudyGuide = async () => {
    // generateMutation.mutate({ courseOutline })
    pdfMutation.mutate({studyGuideId:"sddsd"})
  }

  const handleDownload = () => {
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    // Here you would integrate with Lemon Squeezy
    console.log("Processing payment and sending PDF to:", email)
    setShowPaymentModal(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="w-full p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-600">StudySpace</h2>
        <Link href="https://x.com/ifedayoprince_" target="_blank" rel="noopener noreferrer">
          <Twitter className="w-6 h-6 text-indigo-500 hover:text-indigo-600 transition-colors" />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-8 md:p-12 lg:p-16">
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
              <CardContent className="p-8 space-y-6">
                <div>
                  <label htmlFor="outline" className="block text-lg font-medium text-gray-700 mb-2">Drop your course outline 📚</label>
                  <Textarea
                    id="outline"
                    placeholder="Paste that syllabus here..."
                    value={courseOutline}
                    onChange={(e) => setCourseOutline(e.target.value)}
                    className="min-h-[150px] w-full text-lg rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <Button
                  onClick={generateStudyGuide}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  disabled={generateMutation.isLoading}
                >
                  {generateMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Crafting your guide...
                    </>
                  ) : (
                    'Generate Study Guide 🚀'
                  )}
                </Button>
              </CardContent>
            </Card>

            {studyGuide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <Card className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-purple-100 w-full max-w-4xl mx-auto">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
                    <CardTitle className="text-3xl font-bold text-white">Your Study Guide 🎉</CardTitle>
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/50 rounded-full px-4 py-2 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {studyGuide.topics.map((topic, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-xl font-semibold">{topic.name}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <p className="text-gray-700"><strong>Overview:</strong> {topic.overview}</p>
                              <p className="text-gray-700"><strong>Learning Objective:</strong> {topic.learningObjective}</p>
                              <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-2">Recommended Videos:</h4>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
                                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
                                  <Carousel className="w-full">
                                    <CarouselContent className="-ml-2 md:-ml-4">
                                      {topic.videos.map((video, videoIndex) => (
                                        <CarouselItem key={videoIndex} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                                            <img
                                              src={`https://img.youtube.com/vi/${video.split('v=')[1]}/0.jpg`}
                                              alt={`Video ${videoIndex + 1} thumbnail`}
                                              className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <Button
                                                variant="secondary"
                                                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                onClick={() => window.open(video, '_blank')}
                                              >
                                                Play
                                              </Button>
                                            </div>
                                          </div>
                                        </CarouselItem>
                                      ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                  </Carousel>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-md">
                      <h3 className="text-2xl font-bold text-indigo-800 mb-4">Want the full study guide?</h3>
                      <p className="text-gray-700 mb-4">
                        This is just a preview! Get access to the complete study guide with:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-6">
                        <li>Detailed explanations for each topic</li>
                        <li>Practice comprehension questions</li>
                        <li>Additional curated video resources</li>
                        <li>Downloadable PDF for offline studying</li>
                      </ul>
                      <Button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Unlock Full Study Guide for $1
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {studyGuide && (
              <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-md rounded-3xl border-2 border-purple-100">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-indigo-600">Download Your Study Guide</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Get your personalized study guide sent directly to your email for just $1.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-gray-700">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Pay $1 and Download
                  </Button>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="w-full p-6 text-center text-gray-600">
        <p>© 2024 StudySpace. Made with 💜 by Ifedayo</p>
      </footer>
    </div>
  )
}