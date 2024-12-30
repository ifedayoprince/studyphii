import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

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
  title: 'Get exam-ready in record time | StudyPhii',
  description: 'StudyPhii is a platform that helps you ace every exam with less effort using specially crafted practice questions.',
  manifest: "./manifest.json",
  openGraph: {
    url: 'https://study.phii.space',
    type: 'website',
    title: 'Get exam-ready in record time | StudyPhii',
    description: 'StudyPhii is a platform that helps you ace every exam with less effort using specially crafted practice questions.',
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
    title: 'Get exam-ready in record time | StudyPhii',
    description: 'StudyPhii is a platform that helps you ace every exam with less effort using specially crafted practice questions.',
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
        {env.NEXT_PUBLIC_ENV == "production" && <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="c7b9b62d-9fad-4050-93b4-10037352ea1e"
          defer
          />}
      <body>
        <Providers>
          {children}
          <InfluencerTracker session={session} />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
