"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Download } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/trpc/react"
import { StudyGuideTeaser } from '@/server/api/routers/studyGuide'
// import mockTeaser from '@/server/data/mock-teaser.json'
import { downloadPDF } from '@/app/utils/pdf'
import XIcon from './x.svg'
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export default function StudyGuideGenerator() {
  const { toast } = useToast()
  const [courseOutline, setCourseOutline] = useState('')
  const [studyGuideTeaser, setStudyGuideTeaser] = useState<StudyGuideTeaser | null>(null)
  const [studyGuideId, setStudyGuideId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showFollowUsModal, setShowFollowUsModal] = useState(false)

  const generateGuideMutation = api.studyGuide.generateStudyGuide.useMutation({
    onSuccess: (data) => {
      setStudyGuideTeaser(data.teaser)
      setStudyGuideId(data.id)
      toast({
        title: "Study Guide Generated",
        description: "Your study guide is ready for download!",
      })
    },
    onError: (error) => {
      console.error("Error generating study guide:", error)
      toast({
        title: "Error",
        description: "Failed to generate study guide. Please try again.",
        variant: "destructive",
      })
    }
  })
  const generateStudyGuide = async () => generateGuideMutation.mutate({ courseOutline })


  return (<div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <a id="downloadButton" className="hidden" href="#"></a>
    <header className="w-full p-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-indigo-600">StudyPhii</h2>
      <Link href="https://x.com/ifedayoprince_" target="_blank" rel="noopener noreferrer">
        <Image src={XIcon} alt="X" width={24} height={24} />
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
                disabled={generateGuideMutation.status === 'pending'}
              >
                {generateGuideMutation.status === 'pending' ? (
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
              <Teaser studyGuideTeaser={studyGuideTeaser} setShowPaymentModal={setShowPaymentModal} />
            </motion.div>
          )}

          <DownloadModal open={showPaymentModal} onOpenChange={setShowPaymentModal} studyGuideId={studyGuideId} setShowFollowUsModal={setShowFollowUsModal} />
          <FollowUsModal open={showFollowUsModal} onOpenChange={setShowFollowUsModal} />
        </motion.div>
      </div>
    </main>
    <footer className="w-full p-6 text-center text-gray-600">
      <p>© 2024 StudyPhii. Made with 💜 by Ifedayo</p>
    </footer>
  </div>
  )
}

const DownloadModal = ({ open, onOpenChange, studyGuideId, setShowFollowUsModal }: { open: boolean, onOpenChange: (open: boolean) => void, studyGuideId: string | null, setShowFollowUsModal: (open: boolean) => void }) => {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const generatePdfMutation = api.pdf.generatePDF.useMutation({
    onSuccess: (data) => {
      downloadPDF(data);
      onOpenChange(false)
      setShowFollowUsModal(true)
      toast({
        title: "Success",
        description: "Your study guide has been downloaded.",
      })
    },
    onError: (error) => {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleDownload = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }
    generatePdfMutation.mutate({ studyGuideId: studyGuideId || "", email }, {
      onSuccess: () => {
        onOpenChange(false)
        setShowFollowUsModal(true)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-md !rounded-3xl border-2 border-purple-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-600">Download Your Study Guide</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your email to receive your personalized study guide, we hate spam as much as you do.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 rounded-xl transition-all duration-300"
            disabled={generatePdfMutation.status === 'pending'}
          >
            {generatePdfMutation.status === 'pending' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Preparing download...
              </>
            ) : (
              'Download Guide'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
const FollowUsModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-md !rounded-3xl border-2 border-purple-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-indigo-600">You're a study legend! 🎓</DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Your study guide is locked and loaded! We'd love to hear from you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-center text-gray-700 text-lg">
            Drop us a follow on our socials to stay in the loop and hit us up with your thoughts! 🚀
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                window.open('https://www.instagram.com/studyphii', '_blank')
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
            >
              Instagram 📸
            </Button>
            <Button
              onClick={() => {
                window.open('https://www.tiktok.com/@my.studyguide', '_blank')
              }}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
            >
              TikTok 🎵
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
const Teaser = ({ studyGuideTeaser, setShowPaymentModal }: { studyGuideTeaser: StudyGuideTeaser, setShowPaymentModal: (open: boolean) => void }) => {
  return <Card className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-purple-100 w-full max-w-4xl mx-auto">
    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
      <CardTitle className="text-3xl font-bold text-white">{studyGuideTeaser.title}</CardTitle>
      <Button
        onClick={() => setShowPaymentModal(true)}
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
          onClick={() => setShowPaymentModal(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Download Full Study Guide
        </Button>
      </div>
    </CardContent>
  </Card>
}