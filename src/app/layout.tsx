import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster"
import Providers from "./providers";
import { env } from "@/env";
import * as config from './config';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";



export const metadata = config.metadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dar`}>
      <body>
        <Providers>
          {children}
        </Providers>

        <Toaster />
        {env.NEXT_PUBLIC_ENV === 'production' && <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="e5960873-de0f-4c97-ba94-6fd0c953524f"
          strategy="lazyOnload"
        />}
      </body>
    </html>
  );
}
