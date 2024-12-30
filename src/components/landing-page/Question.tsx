import { Button, Radio, RadioGroup, Textarea, Tooltip, Accordion, AccordionItem } from "@nextui-org/react";
import { useCallback, useEffect, useId } from "react";
import { Magicpen, Send2, Book1, EyeSlash, Additem } from "iconsax-react";
import { QuestionType } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";


const QuestionHead: React.FC<{
  id: number;
  type: QuestionType;
  userAnswer: string;
  content: string;
  isCorrect?: number;
}> = ({
  id,
  content,
  type,
  isCorrect,
  userAnswer,
}) => {
    if (!content) return null;

    if (type === "FILL_IN_BLANKS") {
      const regex = /(\s\{\{\s*slot\s*\}\}|\s_{10})/gi;
      const segments = content.split(regex);

      const calculateWidth = useCallback((value: string, inputElement: HTMLInputElement) => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.fontSize = window.getComputedStyle(inputElement).fontSize;
        span.style.fontFamily = window.getComputedStyle(inputElement).fontFamily;
        span.textContent = value || inputElement.placeholder;

        document.body.appendChild(span);
        const width = Math.max(112, span.offsetWidth);
        inputElement.style.setProperty('--input-width', `${width}px`);
        document.body.removeChild(span);
      }, []);

      return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-xl items-baseline flex flex-wrap gap-2">
          {segments.map((segment, idx) => {
            if (regex.test(segment)) {
              return (
                <div key={`slot-${id}-${idx}`} className="flex items-center">
                  <input
                    ref={(el) => {
                      if (el && userAnswer) {
                        calculateWidth(userAnswer, el);
                      }
                    }}
                    className={`bg-transparent text-xl py-0 !outline-none border-b-3 min-w-[7rem] w-[var(--input-width,7rem)] my-1 ${isCorrect === 1
                      ? "border-success-600 text-success-600 dark:border-success-400 dark:text-success-400"
                      : isCorrect === 2
                        ? "border-danger-600 text-danger-600 dark:border-danger-400 dark:text-danger-400"
                        : "border-gray-600 text-gray-500 dark:border-gray-700 dark:text-gray-400"}`}
                    placeholder=""
                    type="text"
                    value={userAnswer}
                  />
                </div>
              );
            }

            return (
              <ReactMarkdown
                key={`text-${id}-${idx}`}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  p: ({ children }) => (
                    <span className="break-words whitespace-normal inline-block">{children}</span>
                  ),
                }}
              >
                {segment}
              </ReactMarkdown>
            );
          })}
        </div>
      );
    }
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            p: ({ children }) => (
              <p className="text-lg md:text-xl mb-2 last:mb-0">{children}</p>
            ),
            pre: ({ node, ...props }) => (
              <div className="overflow-auto rounded-lg bg-default-200 p-2 my-2">
                <pre {...props} />
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

const QuestionOptions: React.FC<{
  id: number;
  type: QuestionType;
  userAnswer: string;
  options?: string[];
  isCorrect?: number;
}> = ({
  id,
  type,
  isCorrect,
  userAnswer,
  options,
}) => {
    if (type == "MULTIPLE_CHOICE")
      return <RadioGroup
        color="default"
        value={userAnswer}
      >
        {options?.map((option, i) => (
          <li key={`opt-${id}-${i}`} className="list-none mb-1">
            <Radio value={option.toLowerCase()}
              classNames={{
                control: `${(isCorrect == 1 && userAnswer == option.toLowerCase()) ? "!bg-success-600 dark:!bg-success-400" : (isCorrect == 2 && userAnswer == option.toLowerCase()) ? "!bg-danger-600 dark:!bg-danger-400" : "!bg-default-600 dark:!bg-default-400"}`,
                wrapper: `${(isCorrect == 1 && userAnswer == option.toLowerCase()) ? "!border-success-600 dark:!border-success-400" : (isCorrect == 2 && userAnswer == option.toLowerCase()) ? "!border-danger-600 dark:!border-danger-400" : "!border-default-600 dark:!border-default-400"}`
              }}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  components={{
                    p: ({ children }) => (
                      <p className="text-lg mb-0">{children}</p>
                    ),
                  }}
                >
                  {option}
                </ReactMarkdown>
              </div>
            </Radio>
          </li>
        ))}
      </RadioGroup>
    if (type == "SUBJECTIVE")
      return <Textarea
        className="w-full"
        minRows={1}
        placeholder="Answer"
        value={userAnswer}
        classNames={{
          input: "text-lg scrollbar-hide",
          inputWrapper: `bg-opacity-50 dark:bg-opacity-30 backdrop-blur-md ${isCorrect == 1 ? "border-success-600 text-success-700 dark:border-success-400 dark:text-success-400" : isCorrect == 2 ? "border-danger-600 dark:border-danger-400" : ""}`
        }}
        variant="faded"
        endContent={
          <Button
            isIconOnly
            variant="ghost"
            className="self-end"
          >
            <Send2 />
          </Button>
        }
      />;

    return null;
  }

export const QuestionMock: React.FC<{
  numbering: number;
  question: string;
  type: QuestionType;
  answer: string;
  options?: string[];
  isCorrect?: number;
  showExplanation?: boolean;
  explanation?: string;
  showActions?: boolean;
}> = (props) => {

  useEffect(() => {
    const inputs = document.querySelectorAll(`input[slot-${props.numbering}]`);
    inputs.forEach((input) => {
      const calculateWidth = (value: string, inputElement: HTMLInputElement) => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.fontSize = window.getComputedStyle(inputElement).fontSize;
        span.style.fontFamily = window.getComputedStyle(inputElement).fontFamily;
        span.textContent = value || inputElement.placeholder;

        document.body.appendChild(span);
        const width = Math.max(112, span.offsetWidth);
        inputElement.style.setProperty('--input-width', `${width}px`);
        document.body.removeChild(span);
      };
      calculateWidth(props.answer || "", input as HTMLInputElement);
    });
  }, [props.answer]);

  return <div className="py-3 px-4 md:px-7 md:py-5 group flex gap-3 md:gap-5">

    <h3 className="text-lg md:text-xl font-medium text-gray-500">#</h3>
    <div className="flex flex-col gap-4 w-full">
      <QuestionHead
        id={props.numbering}
        content={props.question}
        type={props.type}
        isCorrect={props.isCorrect}
        userAnswer={props.answer || ""}
      />
      <QuestionOptions
        id={props.numbering}
        type={props.type}
        isCorrect={props.isCorrect}
        userAnswer={props.answer || ""}
        options={props.options}
      />

      {props.showExplanation && (
        <Accordion
          className="w-full"
          selectionMode="single"
          defaultExpandedKeys={["explanation"]}
        >
          <AccordionItem
            key="explanation"
            aria-label="Explanation"
            classNames={{
              base: "border-2 dark:border border-default-200 rounded-xl bg-black/10 dark:bg-white/10  backdrop-blur-md",
              title: "font-medium",
              trigger: "px-4 py-2",
              content: "px-4"
            }}
            title={
              <div className="flex items-center gap-2">
                <Book1 className="text-success-500" size={20} />
                <span className="font-medium">Explanation</span>
              </div>
            }
          >
            <div className="prose prose-sm dark:prose-invert max-w-none py-2">
              {props.explanation?.trim() != "" && <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  p: ({ children }) => (
                    <p className="text-base mb-2 last:mb-0">{children}</p>
                  ),
                }}
              >
                {props.explanation}
              </ReactMarkdown>
              }
            </div>
          </AccordionItem>
        </Accordion>
      )}
      <div className="flex justify-between w-full opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250" style={props.showActions ? {
        transform: "translateY(0)"
      } : {}}>
        <div className={`flex gap-4 items-center`}>
          <Tooltip content="Get AI help with this question" delay={1000}>
            <Button
              startContent={<Magicpen variant="TwoTone" />}
              variant="shadow"
              color="success"
              className="md:flex"
            >
              <span className="hidden md:inline">Explain</span>
            </Button>
          </Tooltip>
        </div>
        <div className="flex gap-2 items-center">
          <Tooltip content="Generate similar practice questions">
            <Button
              isIconOnly={true}
              variant="light"
              size="sm"
            >
              <Additem size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Reveal the answer to this question">
            <Button
              isIconOnly={true}
              variant="light"
              size="sm"
            >
              <EyeSlash size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
}