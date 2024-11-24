"use client"
import { TRPCReactProvider } from '@/trpc/react'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCReactProvider>
                <NextUIProvider>
                    <SessionProvider>
                        {children}
                    </SessionProvider>
                </NextUIProvider>
            </TRPCReactProvider>
        </NextThemesProvider>
    )
}