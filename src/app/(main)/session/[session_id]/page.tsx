import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Session } from "./Session"

export default async function SessionPage() {
    // const session = await getServerAuthSession();
    // if (!session)
    //     redirect("/auth");

    return <div className="w-full flex justify-center h-full">
        <Session />
    </div>
}
