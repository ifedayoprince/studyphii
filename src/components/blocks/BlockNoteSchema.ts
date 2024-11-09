import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { PomodoroTimer } from "./PomodoroTimer";
import { Notebox } from "./NoteBox";
 
export const bnSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,

    // Custom blocks
    pomodoro: PomodoroTimer,
    notebox: Notebox,
  },
});