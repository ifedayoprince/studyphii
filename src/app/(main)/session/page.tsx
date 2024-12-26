import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { NewSession } from "./NewSession"

export default async function SessionPage() {
    const session = await getServerAuthSession();
    if (!session)
        redirect("/auth");

    return <div className="h-screen flex justify-center">
        <NewSession />
    </div>
}