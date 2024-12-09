import { Button, Radio, RadioGroup, Textarea, Tooltip, Accordion, AccordionItem } from "@nextui-org/react";
import DiscussModal from "./DiscussModal";
import { useState, useCallback, useEffect } from "react";
import { Magicpen, Send2, Book1 } from "iconsax-react";
import { Question as IQuestion, QuestionType } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { api } from "@/trpc/react";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "sonner";

interface QuestionContentProps {
  content?: string | null;
  type?: QuestionType;
  isCorrect: number;
  userAnswer: string;
  id: string;
  onAnswerChange: (answer: string) => void;
}

const QuestionHead: React.FC<QuestionContentProps> = ({
  content,
  type,
  isCorrect,
  userAnswer,
  id,
  onAnswerChange
}) => {
  if (!content) return null;

  if (type == "FILL_IN_BLANKS") {
    // Split content into segments using regex that matches {{slot}}
    const regex = /(\s\{\{\s*slot\s*\}\}|\s_{10})/gi
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
              <input
                key={`slot-${id}-${idx}`}
                ref={(el) => {
                  if (el && userAnswer) {
                    calculateWidth(userAnswer, el);
                  }
                }}
                className={`bg-transparent text-xl py-0 !outline-none border-b-3  min-w-[7rem] w-[var(--input-width,7rem)] my-1 ${isCorrect == 1
                  ? "border-success-600 text-success-600 dark:border-success-400 dark:text-success-400"
                  : isCorrect == 2
                    ? "border-danger-600 text-danger-600 dark:border-danger-400 dark:text-danger-400"
                    : "border-gray-600 text-gray-500 dark:border-gray-700 dark:text-gray-400"}`}
                placeholder=""
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  const input = e.target;
                  onAnswerChange(input.value);
                  calculateWidth(input.value, input);
                }}
              />
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
            <p className="text-xl mb-2 last:mb-0">{children}</p>
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

interface QuestionOptionsProps extends QuestionContentProps {
  options?: string[] | null;
  isValidating?: boolean;
  onSubmit?: () => void;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  type,
  isCorrect,
  userAnswer,
  options,
  id,
  onAnswerChange,
  isValidating,
  onSubmit
}) => {
  if (type == "MULTIPLE_CHOICE")
    return <RadioGroup
      color="default"
      value={userAnswer}
      onChange={(e) => onAnswerChange(e.target.value)}
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
      onChange={(e) => onAnswerChange(e.target.value)}
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
          isLoading={isValidating}
          onClick={onSubmit}
        >
          <Send2 />
        </Button>
      }
    />;

  return null;
}

export const Question: React.FC<Partial<IQuestion> & {
  numbering: number,
  sessionId: string,
  refreshQuestions: () => Promise<void>,
  hasDiscussion: boolean
}> = (props) => {
  const [openDiscussModal, setOpenDiscussModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(props.isCorrect == null ? 0 : props.isCorrect == true ? 1 : 2);
  const [userAnswer, setUserAnswer] = useState(props.userAnswer);
  const [isValidating, setIsValidating] = useState(false);
  const id = props?.id || "";
  const [showExplanation, setShowExplanation] = useState(false);

  const validateSubjectiveMutation = api.questions.validateSubjectiveAnswer.useMutation({
    onSuccess: (data) => {
      setIsCorrect(data.isCorrect == "INCORRECT" ? 2 : 1);
      if(data.isCorrect == "TRACK") {
        toast.info("You're on the right track!", {
          description: "Your answer is close, but could be more precise. Check the explanation for details.",
          duration: 4000,
          className: "dark:bg-default-100 dark:text-white",
        });
        setShowExplanation(true);
      }
      setIsValidating(false);
    },
    onError: (error) => {
      console.error("Error validating subjective answer:", error);
      setIsValidating(false);
    },
  });


  const updateAnswerMutation = api.questions.updateQuestionAnswer.useMutation();
  const moreQuestionsMutation = api.questions.generateMoreQuestions.useMutation();

  const validateAnswer = useCallback(async (answer: string) => {
    if (!answer) return;

    if (props.type === "SUBJECTIVE") {
      if (!props.id) return;
      setIsValidating(true);
      validateSubjectiveMutation.mutateAsync({
        questionId: props.id,
        answer: answer,
      });
    } else {
      // Client-side validation for multiple choice and fill-in-blanks
      if (!props.answers) return;

      let newIsCorrect = false;
      switch (props.type) {
        case "MULTIPLE_CHOICE":
          const correctIndex = parseInt(props?.answers[0] ?? "0");
          const selectedIndex = props.options?.findIndex(
            opt => opt.toLowerCase() === answer.toLowerCase()
          ) ?? -1;
          newIsCorrect = selectedIndex === correctIndex;
          setIsCorrect(newIsCorrect ? 1 : 2);
          break;

        case "FILL_IN_BLANKS":
          // Normalize both answers for comparison
          const normalizedInput = answer.trim().toLowerCase();
          const normalizedAnswers = props.answers.map(ans => ans.trim().toLowerCase());

          // Check if the input matches any of the possible answers
          newIsCorrect = normalizedAnswers.some(
            correctAns => normalizedInput === correctAns
          );
          setIsCorrect(newIsCorrect ? 1 : 2);
          break;
      }

      // Update the database with the answer
      if (props.id) {
        updateAnswerMutation.mutate({
          questionId: props.id,
          answer: answer,
          isCorrect: newIsCorrect,
        });
      }
    }
  }, [props.type, props.answers, props.options, props.id, validateSubjectiveMutation, updateAnswerMutation]);

  const debouncedValidate = useDebounce(validateAnswer, 1000);

  const handleAnswerChange = (answer: string) => {
    setUserAnswer(answer);
    if (props.type !== "SUBJECTIVE" && props.type === "MULTIPLE_CHOICE") {
        // For multiple choice, validate immediately
        validateAnswer(answer);
      } else {
        // For fill-in-blanks, use debounced validation
        debouncedValidate(answer);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const generateSimilarQuestions = async () => {
    setIsGenerating(true);
    try {
      await moreQuestionsMutation.mutateAsync({
        sessionId: props.sessionId,
        referenceQuestionId: props.id
      });
      await props.refreshQuestions();
    } finally {
      setIsGenerating(false);
    }
  }
  const handleSubjectiveSubmit = () => {
    if (!userAnswer) return;

    if (userAnswer.trim()) {
      validateAnswer(userAnswer);
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(`input[slot-${id}]`);
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
      calculateWidth(userAnswer || "", input as HTMLInputElement);
    });
  }, [userAnswer, id]);

  const handleRevealAnswer = () => {
    if (!props.answers?.length) return;

    let answer = "";
    switch (props.type) {
      case "MULTIPLE_CHOICE":
        const correctIndex = parseInt(props.answers[0] ?? "");
        answer = (props.options?.[correctIndex] || "").toLowerCase();
        break;
      case "FILL_IN_BLANKS":
      case "SUBJECTIVE":
        answer = props.answers[0] ?? "";
        break;
    }

    handleAnswerChange(answer);
    setShowExplanation(true);
  };

  return <div className="w-full p-10 py-3 rounded-xl group flex gap-8">
    <DiscussModal questionId={props?.id || ""} hasHistory={props.hasDiscussion} isOpen={openDiscussModal} onClose={() => setOpenDiscussModal(false)} />
    <h3 className="text-2xl font-medium text-gray-500">{props.numbering}.</h3>
    <div className="flex flex-col gap-4 w-full">
      <QuestionHead
        content={props.content}
        type={props.type}
        isCorrect={isCorrect}
        userAnswer={userAnswer || ""}
        id={id}
        onAnswerChange={(answer) => {
          setIsCorrect(0);
          handleAnswerChange(answer);
        }}
      />
      <QuestionOptions
        type={props.type}
        isCorrect={isCorrect}
        userAnswer={userAnswer || ""}
        options={props.options}
        id={id}
        onAnswerChange={(answer) => {
          setIsCorrect(0);
          handleAnswerChange(answer);
        }}
        isValidating={isValidating}
        onSubmit={handleSubjectiveSubmit}
      />

      {props.explanation && showExplanation && (
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
              <ReactMarkdown
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
            </div>
          </AccordionItem>
        </Accordion>
      )}
      <div className="flex justify-between w-full opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250">
        <div className="flex gap-4 items-center">
          <Tooltip content="Get AI help with this question" delay={1000}>
            <Button
              startContent={<Magicpen variant="TwoTone" />}
              onClick={() => setOpenDiscussModal(true)}
              variant="shadow"
              color="success">
              Explain
            </Button>
          </Tooltip>
          <Tooltip content="Generate similar practice questions" delay={1000}>
            <Button startContent={null} variant="light" size="sm"
              onClick={generateSimilarQuestions}
              isLoading={isGenerating}>
              More like this
            </Button>
          </Tooltip>
        </div>
        <div className="flex gap-4">
          <Tooltip content="Reveal the answer to this question" delay={1000}>
            <Button
              variant="light"
              size="sm"
              onClick={handleRevealAnswer}
            >
              Reveal Answer
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
}