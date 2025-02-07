"use client"
import { TRPCReactProvider } from '@/trpc/react'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner";
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import SuspendedPostHogPageView from './PostHogPageView'
import { env } from '@/env'
import { usePathname } from 'next/navigation'


export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  useEffect(() => {
    if (env.NEXT_PUBLIC_ENV != "development")
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        capture_pageleave: true,
        capture_pageview: true
      })
  }, [])
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={pathname == "/" ? "dark" : undefined}
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <NextUIProvider>
          <SessionProvider>
            <PHProvider client={posthog}>
              <SuspendedPostHogPageView />
              {children}
              <Toaster richColors />
            </PHProvider>
          </SessionProvider>
        </NextUIProvider>
      </TRPCReactProvider>
    </NextThemesProvider>
  )
}