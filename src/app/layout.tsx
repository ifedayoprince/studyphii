import "@/styles/globals.css";
import "katex/dist/katex.min.css";

import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { Providers } from "./providers";
import { env } from "@/env";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { InfluencerTracker } from "./influencer";
import { getServerAuthSession } from "@/server/auth";

export const metadata: Metadata = {
  title: 'StudyPhii — AI Learning Platform',
  description: 'StudyPhii is a platform that generates practice questions for your study session.',
  icons: [{ rel: "icon", url: "./favicon.ico" }],
  manifest: "manifest.json",
  openGraph: {
    url: 'https://study.phii.space',
    type: 'website',
    title: 'StudyPhii — AI Learning Platform',
    description: 'StudyPhii is a platform that generates practice questions for your study session.',
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
    creator: "Phii Space",
    site: 'https://study.phii.space',
    title: 'StudyPhii — AI Learning Platform',
    description: 'StudyPhii is a platform that generates practice questions for your study session.',
    images: [
      {
        url: './og.png',
        alt: 'StudyPhii Twitter Image'
      }
    ]
  }
};


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}

          <InfluencerTracker session={session} />
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
