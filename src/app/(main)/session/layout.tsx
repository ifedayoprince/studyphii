import { ReactNode } from "react";

export default function MainLayout({children}: {children: ReactNode}) {
    return <div className="min-h-screen flex justify-center w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
        {children}
    </div>
}