import { Input } from "@nextui-org/react";

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
    const QuestionHead = () => {
        if (props.type == "fill-in-the-blanks") {
            const parts = props.question.split(" ");

            return <div className="text-3xl font-medium flex gap-x-2 items-center flex-wrap">
                {parts.map((str, idx)=> {
                    if (str == "{{slot}}") {
                        return <input className="bg-transparent py-0 text-3xl py-0 text-gray-400 !outline-none border-b border-b-3 border-gray-700 w-[7rem]" placeholder="" type="text"  />
                    }
                    return <span className="min-w-max">{str}</span>;
                })}
                </div>;
        }
        return <h2 className="text-3xl font-medium">{props.question}</h2>;
    }
    return <div className="w-full px-3 flex gap-6">
        <h3 className="text-2xl font-medium text-gray-500 s rounded-full w-10 h-10 flex items-center justify-center border border-2">{props.numbering}</h3>
        <div className="flex flex-col gap-3">
            <QuestionHead />
        </div>
    </div>
}