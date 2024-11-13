import { Textarea, Button } from "@nextui-org/react";
import { ArrowUpIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const NewSession = () => {
    const [input, setInput] = useState("");

    const quickStarts = ["Questions on thermodynamics", "Elements in the periodic table", "Integral Calculus"]
    return <div className="flex max-w-2xl flex-col items-center justify-center gap-5 h-screen w-screen">
        <h2 className="text-5xl scale-90 text-center font-semibold mb-4">What can I help you learn?</h2>

        <div className="relative w-full">
            <Textarea maxRows={1} height={"100%"} variant="bordered"
                value={input} onChange={(e) => setInput((e.target.value))}
                placeholder="Ask StudyPhii a question..."
                endContent={<Button className="mt-5" disabled={input.trim() == ""} variant={input.trim() == "" ? "flat" : "shadow"} color="primary" isIconOnly><ArrowUpIcon /></Button>} />

        </div>
        <div className="flex justify-center gap-2">
            {quickStarts.map((quickStart, index) => (
                <p key={index} onClick={() => setInput(quickStart)} className="flex gap-2 items-center rounded-full px-2 py-1 border bg-black/80 hover:bg-black/40 backdrop-blur-sm cursor-pointer text-xs font-medium">{quickStart} <ExternalLinkIcon /></p>
            ))}
        </div>
    </div>
}