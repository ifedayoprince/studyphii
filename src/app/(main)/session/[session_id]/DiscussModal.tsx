import { useState, useRef, useEffect, forwardRef } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button, Avatar, Textarea, Spinner } from "@nextui-org/react";
import { Send, Stop } from "iconsax-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "./chatStore";
import { api } from "@/trpc/react";
import { Message } from "@/server/api/routers/messages";
import { useSession } from "next-auth/react";

interface MessageBubbleProps {
  message: Omit<Message, "role"> & {role: string};
  avatar: string;
}

const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(({ message, avatar }, ref) => {
  const isAI = message.role === "studyphii";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"} items-start gap-2`}
    >
      <div
        className={`${!isAI
            ? "bg-gray-700/40 text-primary-foreground max-w-[70%] rounded-full px-3 py-2"
            : "p-3 pt-1 max-w-[80%]"
          }`}
      >
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert max-w-none"
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {!isAI && (
        <Avatar
          size="sm"
          src={avatar}
          className="mt-0.5"
        />
      )}
    </motion.div>
  );
});

MessageBubble.displayName = "MessageBubble";

interface DiscussModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  hasHistory: boolean;
}

export default function DiscussModal({ isOpen, onClose, questionId, hasHistory }: DiscussModalProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data } = useSession();
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const [abortStream, setAbortStream] = useState(false);

  const {
    getQuestionState,
    addMessage,
    setMessages,
    setIsTyping,
    setHasStarted,
    setError,
    reset,
    initQuestionState
  } = useChatStore();

  const { messages, isTyping, hasStarted } = getQuestionState(questionId);
  const getMessages = api.messages.getMessages.useQuery({ questionId }, { enabled: false });
  const sendMessage = api.messages.sendMessage.useMutation();
  const stopStreaming = api.messages.stopStreaming.useMutation();

  // Initialize question state
  useEffect(() => {
    if (isOpen && !hasStarted) {
      initQuestionState(questionId);
    }
  }, [isOpen, hasStarted, questionId, initQuestionState]);

  // Load message history when modal opens
  useEffect(() => {
    if (isOpen && hasHistory && messages.length === 0) {
      setIsLoading(true);

      getMessages.refetch().then((result) => {
        if (result.data && result.data.length > 0) {
          setMessages(questionId, result.data);
          setHasStarted(questionId, true);
        }
        scrollToBottom();
      }).catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load message history");
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, questionId, hasHistory, setMessages, setError, getMessages, messages.length, setHasStarted]);

  // Reset loading states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setIsTyping(questionId, false);
    }
  }, [isOpen, questionId, setIsTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleAbortStream = async()=>{
      setAbortStream(true)
      await stopStreaming.mutateAsync({ questionId });
  }
  const handleSendMessage = async () => {
    setAbortStream(false)
    const trimmedMessage = currentMessage.trim();
    if (!trimmedMessage || isTyping || isLoading || streamingText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedMessage,
      role: "user",
      questionId,
      createdAt: new Date(),
    };

    addMessage(questionId, userMessage);
    setCurrentMessage("");
    setStreamingText("")
    setIsTyping(questionId, true);
    try {
      sendMessage.mutate({
        content: trimmedMessage,
        questionId,
      }, {
        onSuccess: async (data) => {
          try {
            for await (const val of data) {
              if(abortStream){
                console.log("breaking")
                scrollToBottom();
                break;
              }

              if (typeof val === "string")
                setStreamingText(prev => prev + val);
              else if (typeof val === "object") {
                // Clear streaming text and add final message
                addMessage(questionId, val);
                setStreamingText(null);
                setHasStarted(questionId, true);
              }
              scrollToBottom();
            }
          } catch (err) {
            console.error("Error processing stream:", err);
            setError("Failed to process AI response");
          }
        },
        onError: (err) => {
          console.error("Error sending message:", err);
          setError(err instanceof Error ? err.message : "Failed to send message");
        },
      });
    } finally {
      setAbortStream(false)
      setIsTyping(questionId, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = messages.length > 0
    ? messages
    : [{
      id: "initial",
      content: "How can I help you understand this question better?",
      role: "studyphii",
      questionId,
      createdAt: new Date(),
    }];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      classNames={{
        base: "h-[80vh] max-h-[80vh]",
        body: "p-0 h-full",
        wrapper: "overflow-hidden",
        footer: "border-t-1 border-default-200 sticky bottom-0 bg-background/70 backdrop-blur-md",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalBody>
              <div className="flex flex-col gap-3 overflow-y-auto px-6 pt-6 pb-4 scrollbar-hide h-[calc(80vh-5rem)]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Spinner label="Loading chat history..." color="primary" />
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {displayMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        avatar={data?.user?.image || "https://placekitten.com/200/200"}
                      />
                    ))}
                    {(streamingText == "") && (<motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-2 items-center"
                      >
                        <Avatar
                          size="sm"
                          src="/studyphii-ai.png"
                          className="mt-0.5 p-2"
                        />
                        <div className="bg-white/90 rounded-full w-4 h-4 animate-pulse" />
                        </motion.div>)}
                    {(streamingText && streamingText.trim() != "") && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-2"
                      >
                        <Avatar
                          size="sm"
                          src="/studyphii-ai.png"
                          className="mt-0.5 p-2"
                        />
                        <div className="p-3 pt-1 max-w-[80%]">
                          <ReactMarkdown
                            className="prose prose-sm dark:prose-invert max-w-none"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                          >
                            {streamingText}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ModalBody>
            <ModalFooter className="w-full min-h-max py-2 px-4">
              <div className="flex w-full">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about this question..."
                  classNames={{
                    input: "resize-none text-base px-4 pt-2",
                    inputWrapper: "shadow-none rounded-3xl p-1",
                  }}
                  minRows={1}
                  maxRows={4}
                  className="flex-1"
                  isDisabled={isLoading}
                  endContent={<Button
                    isIconOnly
                    color="primary"
                    variant="shadow"
                    onClick={streamingText ? handleAbortStream : handleSendMessage}
                    isDisabled={!currentMessage.trim() && !!streamingText}
                    isLoading={isLoading || !!streamingText}
                    className={`rounded-full relative  transition-transform duration-200 ${currentMessage.trim() && !isTyping && !isLoading
                        ? "hover:scale-105 active:scale-95"
                        : ""
                      }`}
                  >
                   
                      <Send size={20} className={`transition-transform duration-200 ${currentMessage.trim() && !isTyping && !isLoading
                        ? "hover:translate-x-0.5"
                        : ""
                      }`} />
                  </Button>}
                />

              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}