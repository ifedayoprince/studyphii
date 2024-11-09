"use client"
import { Card, Button } from "@nextui-org/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import Image from 'next/image';
import { useRef } from 'react';
import { bnSchema } from "@/components/blocks/BlockNoteSchema";
import { BlockAdder } from "@/components/layout/BlockAdder";

export default function SessionPage({params}: {params: { session_id: string }}) {
  const editor = useCreateBlockNote({
    schema: bnSchema,
    initialContent: [{ type: "pomodoro" }],
  });

  const blockNoteRef = useRef<HTMLDivElement>(null);

  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const element = blockNoteRef.current?.querySelector('[contenteditable="true"]') as HTMLElement;
      element?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center w-full p-4 pt-0 px-0">
      <Image 
        src="/thumbnail/rocket-moonlight.jpg" 
        width={600} 
        height={600} 
        alt="Thumbnail" 
        className="w-full object-cover h-36 object-center" 
      />

      <section className="w-full max-w-[58rem] relative -top-8">
        <h1 
          className="mt-16 mx-14 mb-4 outline-none text-5xl font-bold" 
          contentEditable 
          onKeyDown={handleTitleKeyDown}
        >
          Untitled Session
        </h1>
        <div ref={blockNoteRef}>
          <BlockNoteView theme="light" editor={editor} />
          <BlockAdder editor={editor} />
        </div>
      </section>
    </div>
  );
}