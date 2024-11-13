import { Modal, ModalBody, ModalContent, ModalFooter, Button, Input, Avatar } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { Send } from "iconsax-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface Message {
    content: string;
    isUser: boolean;
}

interface MarkdownComponentProps {
    children: React.ReactNode;
}

interface CodeComponentProps extends MarkdownComponentProps {
    inline?: boolean;
}

export const DiscussModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;

        setMessages([...messages, { content: currentMessage, isUser: true }]);
        setCurrentMessage("");

        // Simulate AI response - replace with actual AI integration
        setTimeout(() => {
            setMessages(prev => [...prev, {
                content: "Here's a math equation: $E = mc^2$\n\nAnd here's\n # Loving it\n ## Level 2 \n ### Level 3\n some **bold text** and a list:\n\n1. Item 1\n2. Item 2\n\nYou can also write chemical equations: $H_2O + CO_2 \\rightarrow H_2CO_3$",
                isUser: false
            }]);
        }, 1000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            shouldBlockScroll={true}
            size="4xl"
            classNames={{
                base: "h-[80vh] max-h-[80vh]",
                body: "p-0 pt-4",
                wrapper: "overflow-hidden",
                footer: "border-t-1 border-default-200 py-2",
            }}
            motionProps={{
                variants: {
                    enter: {
                        y: -20,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: 20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody >
                            <div
                                ref={chatContainerRef}
                                className="flex flex-col gap-3 h-[calc(80vh-90px)] overflow-y-auto p-4 px-6 scrollbar-hide"
                            >
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.isUser ? "justify-end" : "justify-start"} items-start gap-2`}
                                    >
                                        {!message.isUser && (
                                            <Avatar
                                                src="/studyphii-avatar.png"
                                                className="flex-shrink-0"
                                                size="sm"
                                            />
                                        )}
                                        <div
                                            className={`
                        ${message.isUser
                                                    ? "bg-default/30 text-foreground max-w-[80%] rounded-3xl px-4 py-2"
                                                    : "px-4 py-0"
                                                }`}
                                        >
                                            {message.isUser ? (
                                                <p>{message.content}</p>
                                            ) : (
                                                <ReactMarkdown
                                                    className="prose dark:prose-invert max-w-none"
                                                    remarkPlugins={[remarkMath, remarkGfm]}
                                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                    components={{
                                                        p: ({ children }: MarkdownComponentProps) => (
                                                            <p className="mb-2 last:mb-0">{children}</p>
                                                        ),
                                                        ul: ({ children }: MarkdownComponentProps) => (
                                                            <ul className="list-disc ml-4 mb-2">{children}</ul>
                                                        ),
                                                        ol: ({ children }: MarkdownComponentProps) => (
                                                            <ol className="list-decimal ml-4 mb-2">{children}</ol>
                                                        ),
                                                        li: ({ children }: MarkdownComponentProps) => (
                                                            <li className="mb-1">{children}</li>
                                                        ),
                                                        code: ({ inline, children }: CodeComponentProps) => (
                                                            inline
                                                                ? <code className="bg-default-200 px-1 py-0.5 rounded">{children}</code>
                                                                : <pre className="bg-default-200 p-2 rounded-lg overflow-x-auto">{children}</pre>
                                                        ),
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} className="h-px" />
                            </div>
                        </ModalBody>
                        <ModalFooter className="w-full min-h-fit">
                            <div className="flex w-full gap-2 py-3">
                                <Input
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Speak with StudyPhii..."
                                    classNames={{
                                        input: "min-h-unit-12",
                                        inputWrapper: "min-h-unit-12",
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    isIconOnly
                                    color="primary"
                                    onClick={handleSendMessage}
                                    isDisabled={!currentMessage.trim()}
                                    className="min-h-unit-12 min-w-unit-12"
                                >
                                    <Send size={20} />
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};