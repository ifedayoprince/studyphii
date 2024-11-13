import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Radio, RadioGroup, Textarea, Tooltip } from "@nextui-org/react";
import { DotsHorizontalIcon, DotsVerticalIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { DiscussModal } from "./DiscussModal";
import { useState } from "react";
import { Magicpen } from "iconsax-react";


export interface IQuestion {
    question: string;
    type: "multiple-choice" | "fill-in-the-blanks" | "subjective";
    options?: {
        value: string;
        key: string;
        isCorrect: boolean;
    }[];
    /*
    - Multiple choice: index of the correct option
    - Fill in the blanks: array of the answers filled in
    - Subjective/Essay: the answer
    */
    answer?: number | string[] | string;
}

export const Question: React.FC<IQuestion & { numbering: number }> = (props) => {
    const [openDiscussModal, setOpenDiscussModal] = useState(false);

    const QuestionHead = () => {
        if (props.type == "fill-in-the-blanks") {
            const parts = props.question.split(" ");

            return <div className="text-xl flex gap-x-2 items-center flex-wrap">
                {parts.map((str, idx) => {
                    if (str == "{{slot}}") {
                        return <input className="bg-transparent text-xl py-0 text-gray-400 !outline-none border-b-3 border-gray-700 w-[7rem]" placeholder="" type="text" />
                    }
                    return <span className="min-w-max">{str}</span>;
                })}
            </div>;
        }
        return <h2 className="text-xl">{props.question}</h2>;
    }
    const QuestionOptions = () => {
        if (props.type == "multiple-choice")
            return <RadioGroup>
                {props.options?.map((option, i) => <li key={i} className="list-none mb-1">
                    <Radio value={option.key}><p className="text-lg">{option.value}</p></Radio>
                </li>)}
            </RadioGroup>
        if (props.type == "subjective")
            return <Textarea className="w-full" minRows={1}
                placeholder="Answer"
                classNames={{
                    input: "text-lg scrollbar-hide"
                }} variant="faded" />;

        return null;
    }
    return <div className="w-full p-10 py-3 rounded-xl group flex gap-8">
        <DiscussModal isOpen={openDiscussModal} onClose={() => setOpenDiscussModal(false)} />
        <h3 className="text-2xl font-medium text-gray-500">{props.numbering}.</h3>
        <div className="flex flex-col gap-4 w-full">
            <QuestionHead />
            <QuestionOptions />
            <div className="flex gap-4 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250">
                <Tooltip content="Get AI help with this question" delay={1000}>
                    <Button 
                        startContent={<Magicpen variant="TwoTone" />} 
                        onClick={() => setOpenDiscussModal(true)} 
                        variant="shadow" 
                        color="success">
                        Discuss
                    </Button>
                </Tooltip>
                <Tooltip content="Generate similar practice questions" delay={1000}>
                    <Button startContent={null} variant="light">
                        More like this
                    </Button>
                </Tooltip>
            </div>
        </div>
        {/* <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light"><DotsHorizontalIcon /></Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions" variant="faded">
                <DropdownItem key="more">More like this</DropdownItem>
                <DropdownItem key="report" className="text-danger" color="danger">
                    Report
                </DropdownItem>
            </DropdownMenu>
        </Dropdown> */}
    </div>
}