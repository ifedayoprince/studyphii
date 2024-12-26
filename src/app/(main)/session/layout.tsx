"use client"
import { ReactNode, useState } from "react";
import { SessionHeader } from "./[session_id]/SessionHeader";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
    const [openSidebar, setOpenSidebar] = useState(false);
    const pathname = usePathname()

    return <div className="flex w-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
        <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
        <main className="grid grid-rows-[min-content,auto] items-center w-full h-screen overflow-x-hidden relative">
            <SessionHeader onOpenSidebar={() => setOpenSidebar(true)} openSidebar={openSidebar} newSession={pathname.startsWith("/session") && pathname.lastIndexOf("/") == 0} />
            <div className="h-full w-full max-h-full overflow-y-hidden px-5 md:px-0">
                {children}
            </div>
        </main>
    </div>
}