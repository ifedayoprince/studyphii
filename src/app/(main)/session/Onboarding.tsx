"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Modal, ModalContent } from "@nextui-org/react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { PricingSlide } from "./PricingSlide";



function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: false });
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: session } = useSession();

  const slides = [
    {
      id: "welcome",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center h-full justify-center space-y-6 p-8 text-center"
        >
          <h1 className="text-4xl font-bold">
            {getTimeBasedGreeting()}{(session?.user?.name ? ` ${session?.user?.name?.split(" ")[0]}` : "")},
          </h1>
          <h3 className="text-3xl">Welcome to StudyPhii</h3>
          <p className="text-gray-400">
            Let's get you started with personalized learning
          </p>
        </motion.div>
      ),
    },
    {
      id: "video",
      content: (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full rounded-lg"
            width="1280" height="720"
            src="https://youtube.com/embed/DK_I5fJuVss?mute=1&controls=0&playsinline=1&hd=1&vq=hd720&loop=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={(e) => {
              const iframe = e.currentTarget;
              iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }}
          />
        </div>
      ),
    },
    {
      id: "usage",
      content: (
        <div className="space-y-6 p-8 text-center flex flex-col justify-between items-center h-full">
          <h3 className="text-3xl font-semibold">How to Use</h3>
          <div className="space-y-4">
            <p className="text-gray-400">
              Numerous scientific papers prove that taking practice questions before studying improves learning greatly.
            </p>
            <p className="text-gray-400">
              StudyPhii is designed to be used <strong>before</strong> and <strong>after</strong> studying to help you learn better.
            </p>
          </div>
          <div className="flex flex-col gap-6 items-center justify-center">
            <h1 className="text-5xl font-bold">P - R - P</h1>
            <h3 className="text-2xl font-semibold">Practice - Read - Practice</h3>
          </div>
          <div></div>
        </div>
      ),
    },
    {
      id: "pricing",
      content: <PricingSlide modal />,
    },
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className={`mx-4 w-full max-w-4xl ${currentSlide === slides.length - 1 ? "h-[70vh] md:h-full" : "h-[55vh] md:h-full"}`}
      isDismissable={false}
      hideCloseButton={true}>
      <ModalContent>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex max-h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`relative flex-[0_0_100%] scrollbar-hide min-w-0 ${((index == slides.length - 1) || (index == slides.length - 2))
                  ? "overflow-y-auto"
                  : ""}`}
                style={{ opacity: 1 }}
              >
                {slide.content}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-gray-300" : "bg-gray-600"
                  }`} />
            ))}
          </div>
          <div className="flex space-x-4">
            <Button
              isIconOnly
              variant="light"
              onClick={scrollPrev}
              isDisabled={currentSlide === 0}>
              <ArrowLeft2 />
            </Button>
            <Button
              isIconOnly
              variant="light"
              onClick={scrollNext}
              isDisabled={currentSlide === slides.length - 1}>
              <ArrowRight2 />
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}