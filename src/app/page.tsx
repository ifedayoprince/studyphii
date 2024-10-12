"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Twitter, Download } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/trpc/react"
import { StudyGuideTeaser } from '@/server/api/routers/studyGuide'
import mockTeaser from '@/server/data/mock-teaser.json'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

export default function StudyGuideGenerator() {
  const router = useRouter();
  const [courseOutline, setCourseOutline] = useState('')
  const [studyGuideTeaser, setStudyGuideTeaser] = useState<StudyGuideTeaser | null>(mockTeaser.teaser)
  const [studyGuideId, setStudyGuideId] = useState<string | null>(mockTeaser.id)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [showCheckoutIframe, setShowCheckoutIframe] = useState(false)

  const createCheckoutMutation = api.paymentManagement.createCheckoutForVariant.useMutation({
    onSuccess: (data) => {
      const url = data?.data?.data?.attributes?.url
      if (url) {
        setCheckoutUrl(url)
        setShowCheckoutIframe(true)
      }
    },
    onError: (error) => {
      console.error("Error creating checkout:", error)
      // Handle error (e.g., show an error message to the user)
    }
  })

  // useEffect(() => {
  //   const lemonsqueezy = (window as any).createLemonSqueezy()
  //   lemonsqueezy.setup({
  //     eventHandler: (event: any) => {
  //       if (event.event === 'checkout.completed') {
  //         // Handle successful payment
  //         setShowPaymentModal(false)
  //         setShowCheckoutIframe(false)
  //         // Implement logic to provide access to the full study guide
  //       }
  //     }
  //   })
  // }, [])

  const generateMutation = api.studyGuide.generateStudyGuide.useMutation({
    onSuccess: (data) => {
      console.log(JSON.stringify(data))
      setStudyGuideTeaser(data.teaser)
      setStudyGuideId(data.id)
    },
    onError: (error) => {
      console.error("Error generating study guide:", error)
      // Handle error (e.g., show an error message to the user)
    }
  })

  const generateStudyGuide = async () => {
    generateMutation.mutate({ courseOutline })
  }

  const handleDownload = () => {
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    if (studyGuideId) {
      createCheckoutMutation.mutate({ guideId: studyGuideId })
    }
  }

  const handleSampleDownload = () => {
    // Implement sample download logic here
    console.log("Downloading sample...")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <a id="downloadButton" className="hidden" href="#"></a>
      <header className="w-full p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-600">StudyPhii</h2>
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
                  disabled={generateMutation.status === 'pending'}
                >
                  {generateMutation.status === 'pending' ? (
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

            {studyGuideTeaser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <Card className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-purple-100 w-full max-w-4xl mx-auto">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
                    <CardTitle className="text-3xl font-bold text-white">{studyGuideTeaser.title}</CardTitle>
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
                      {studyGuideTeaser.chapters.map((chapter, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-xl font-semibold">{chapter.title}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold">Topics:</h4>
                              <ul className="list-disc list-inside">
                                {chapter.topics.map((topic, topicIndex) => (
                                  <li key={topicIndex} className="text-gray-700">{topic}</li>
                                ))}
                              </ul>
                              {chapter.video && (
                                <div className="mt-4">
                                  <h4 className="text-lg font-semibold mb-2">Preview Video:</h4>
                                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                                    <img
                                      src={`https://i.ytimg.com/vi/${chapter.video}/hqdefault.jpg`}
                                      alt={`Chapter ${index + 1} video thumbnail`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Button
                                        variant="secondary"
                                        className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${chapter.video}`, '_blank')}
                                      >
                                        Play
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
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

            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
              <DialogContent className={`sm:max-w-[425px] bg-white/80 backdrop-blur-md rounded-3xl border-2 border-purple-100 ${showCheckoutIframe && "border-none p-0"}`}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-indigo-600">Download Your Study Guide</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Get your personalized study guide for just $1.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  {showCheckoutIframe && checkoutUrl ? (
                    <iframe
                      src={checkoutUrl}
                      className="w-full h-[600px] border-0"
                    />
                  ) : (
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      disabled={createCheckoutMutation.status === 'pending'}
                    >
                      {createCheckoutMutation.status === 'pending' ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Preparing checkout...
                        </>
                      ) : (
                        'Pay $1 and Download'
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={handleSampleDownload}
                    variant="outline"
                    className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 rounded-xl transition-all duration-300"
                  >
                    Download Sample
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </main>
      <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
      <footer className="w-full p-6 text-center text-gray-600">
        <p>© 2024 StudyPhii. Made with 💜 by Ifedayo</p>
      </footer>
    </div>
  )
}