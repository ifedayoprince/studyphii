'use client'

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation'
import { TRPCReactProvider } from "@/trpc/react";


export default function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        // eslint-disable-next-line @typescript-eslint/unbound-method
        <NextUIProvider navigate={router.push}>
            <TRPCReactProvider>
                {children}
            </TRPCReactProvider>
        </NextUIProvider>
    )
}