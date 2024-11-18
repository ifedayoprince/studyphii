"use client"
import { TRPCReactProvider } from '@/trpc/react'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <TRPCReactProvider>
        <NextUIProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
        </NextUIProvider>
    </TRPCReactProvider>
}