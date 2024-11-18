import "@/styles/globals.css";
import "katex/dist/katex.min.css";

import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers";
import { env } from "@/env";

export const metadata = {
  title: 'StudyPhii — AI Learning Platform',
  description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips..',
  icons: [{ rel: "icon", url: "./favicon.ico" }],
  openGraph: {
    url: 'https://study.phii.space',
    type: 'website',
    title: 'StudyPhii — Study Guide Generator',
    description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips.',
    images: [
      {
        url: './og.png',
        width: 1200,
        height: 630,
        alt: 'StudyPhii OpenGraph Image'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    domain: 'study.phii.space',
    url: 'https://study.phii.space',
    title: 'StudyPhii — Study Guide Generator',
    description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips.',
    images: [
      {
        url: './og.png',
        alt: 'StudyPhii Twitter Image'
      }
    ]
  }
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        
        {env.NEXT_PUBLIC_ENV == "production" && <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="e5960873-de0f-4c97-ba94-6fd0c953524f"
          strategy="lazyOnload"
        />}
      </body>
    </html>
  );
}
