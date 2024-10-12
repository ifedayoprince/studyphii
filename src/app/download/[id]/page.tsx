import { redirect } from 'next/navigation'
import { api } from '@/trpc/server'
import { renderToBuffer } from "@react-pdf/renderer"
import PDFDocument from "@/components/pdf/PDFDocument"
import { db } from "@/server/db"

export default async function DownloadPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Check if the study guide has been paid for
  const studyGuideStatus = await api.studyGuide.checkPaymentStatus.query({ studyGuideId: id })

  if (!studyGuideStatus.isPaid) {
    // If not paid, redirect to the home page
    redirect('/')
  }

  // If paid, generate and download the PDF
  const studyGuide = await db.studyGuide.findUnique({
    where: { id },
    include: {
      chapters: {
        include: {
          topics: {
            include: {
              videos: true
            }
          }
        }
      }
    }
  })

  if (!studyGuide) {
    throw new Error('Study guide not found')
  }

  const pdfBuffer = await renderToBuffer(<PDFDocument data={studyGuide} />)

  // Set headers for file download
  const headers = new Headers()
  headers.set('Content-Disposition', `attachment; filename="${studyGuide.fileName}.pdf"`)
  headers.set('Content-Type', 'application/pdf')

  // Redirect to home page after setting up the download
  redirect('/')

  // This return statement is necessary for TypeScript, but it will never be reached
  return new Response(pdfBuffer, {
    headers: headers,
  })
}
