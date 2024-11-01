"use client"
import { Card } from "@nextui-org/card";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";


export default function SessionPage({
  params,
}: {
  params: { session_id: string };
}) {
  const editor = useCreateBlockNote({

  });

  return (
    <div className="min-h-screen w-full p-4 border border-red-600">
      <Card className="w-full p-6 mb-2">
        <h1 className="text-4xl font-bold">Untitled Session</h1>
      </Card>
      <BlockNoteView theme="light" editor={editor} className="border border-red-600"/>
    </div>
  );
}