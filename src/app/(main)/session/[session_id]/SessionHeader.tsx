"use client";

import { Avatar, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tabs, Tab, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react"
import { useState, useEffect } from "react";
import { RefineModal } from "./RefineModal";
import { EndSessionModal } from "./EndSessionModal";
import { useRouter } from "next/navigation";
import { SidebarRight, Moon, Sun, Mobile, ArrowDown2 } from "iconsax-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useGlobalStore } from './globalStore';
import { useTheme } from "next-themes";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "@/hooks/use-toast";
import posthog from "posthog-js";

interface SessionHeaderProps {
  onOpenSidebar: () => void;
  openSidebar: boolean;
  newSession?: boolean;
  mock?: boolean;
}

export const SessionHeader = ({ onOpenSidebar, openSidebar, newSession, mock }: SessionHeaderProps) => {
  const { data } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isActionButtonOpen, setIsActionButtonOpen] = useState(false);
  const isOnline = useOnlineStatus();

  const router = useRouter();
  const params = useParams();
  const sessionId = params.session_id as string;
  const [isGenerating, setIsGenerating] = useState(false);
  const { sessionQuestionsRefresher } = useGlobalStore();
  const moreQuestionsMutation = api.questions.generateMoreQuestions.useMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRefinePrompt = async (topic: string) => {
    if (!isOnline) {
      toast({
        title: "You are offline!",
        description: "Please connect to the internet to generate more questions."
      });
      return;
    }
    setIsGenerating(true);
    try {
      await moreQuestionsMutation.mutateAsync({
        sessionId,
        refinePrompt: topic
      });
      await sessionQuestionsRefresher();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEndSession = () => {
    // TODO: Implement session end logic
    router.push("/session");
  };

  const ActionButtons = ({ isMobile = false }) => (
    <>
      <Button
        variant={isMobile ? "light" : "shadow"}
        color="primary"
        onClick={() => {
          setIsTopicModalOpen(true)
          setIsActionButtonOpen(false);
        }}
        isLoading={isGenerating}
        className="w-full"
      >
        Refine
      </Button>
      <Button
        variant="light"
        color="danger"
        onClick={() => {
          setIsEndModalOpen(true)
          setIsActionButtonOpen(false);
        }}
        className="w-full"
      >
        End Session
      </Button>
    </>
  );

  return (
    <>
      <nav className={`${newSession && "absolute top-0"} flex items-center justify-between py-4 px-5 md:px-10 z-10 backdrop-blur-md w-full`}>
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: openSidebar ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              isIconOnly
              variant="light"
              onClick={onOpenSidebar}
              className={openSidebar ? "pointer-events-none hidden" : ""}
            >
              <SidebarRight variant="TwoTone" />
            </Button>
          </motion.div>
          {/* Desktop Title */}
          {!newSession && (
            <h2 className="hidden md:block text-xl font-medium">
              StudyPhii
            </h2>
          )}
        </div>

        {/* Mobile Title with Popover */}
        {!newSession && (
          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <Popover
              placement="bottom"
              showArrow
              shouldBlockScroll
              shouldCloseOnInteractOutside={() => true}
              onClose={() => setIsActionButtonOpen(false)}
              isOpen={isActionButtonOpen}
            >
              <PopoverTrigger>
                <Button
                  variant="light"
                  className="flex items-center gap-1"
                  onClick={() => setIsActionButtonOpen(true)}
                >
                  <span className="text-xl font-medium">StudyPhii</span>
                  <ArrowDown2 size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-[200px]">
                <div className="flex flex-col gap-2 w-full">
                  <ActionButtons isMobile />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="flex gap-3">
          {/* Desktop Action Buttons */}
          {!newSession && (
            <div className="hidden md:flex gap-3">
              <ActionButtons />
            </div>
          )}

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="md"
                isBordered
                as="button"
                src={mock ? "https://i.pravatar.cc/150?img=9" : (data?.user?.image || "https://placekitten.com/200/200")}
                className="transition-transform" />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{data?.user?.name}</p>
                <p className="font-normal text-sm text-default-500">{data?.user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="theme"
                className="cursor-default"
                as="li"
                closeOnSelect={false}
              >
                <div className="w-full py-1">
                  <Tabs
                    aria-label="Theme options"
                    selectedKey={theme || "system"}
                    onSelectionChange={(key) => setTheme(key as string)}
                    size="sm"
                    color="primary"
                    variant="light"
                    classNames={{
                      tabList: "gap-2 w-full justify-between py-0",
                      base: "w-full",
                      cursor: "w-full",
                      tab: "px-2 h-8",
                    }}
                  >
                    <Tab
                      key="light"
                      title={
                        <div className="flex items-center gap-2">
                          <Sun size={16} />
                        </div>
                      }
                    />
                    <Tab
                      key="dark"
                      title={
                        <div className="flex items-center gap-2">
                          <Moon size={16} />
                        </div>
                      }
                    />
                    <Tab
                      key="system"
                      title={
                        <div className="flex items-center gap-2">
                          <Mobile size={16} />
                        </div>
                      }
                    />
                  </Tabs>
                </div>
              </DropdownItem>
              {/* <DropdownItem key="settings" onClick={() => {
                router.push("/session/upgrade")
              }}>Upgrade</DropdownItem> */}
              <DropdownItem key="logout" color="danger" onClick={() => {
                posthog.reset(true)
                signOut({ callbackUrl: "/" })
              }}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>

      <RefineModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSubmit={handleRefinePrompt}
      />

      <EndSessionModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleEndSession}
      />
    </>
  );
}