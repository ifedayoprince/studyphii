import { BlockNoteEditor } from "@blocknote/core"
import { Button } from "@nextui-org/react"
import { bnSchema } from "../blocks/BlockNoteSchema"

type Editor = BlockNoteEditor<typeof bnSchema.blockSchema, typeof bnSchema.inlineContentSchema, typeof bnSchema.styleSchema>

export const BlockAdder = ({ editor }: { editor: Editor }) => {
    return <div className="w-full grid-cols-4 items-center gap-3 px-32 opacity-0 grid transition-all translate-y-3 duration-300 hover:opacity-100 hover:translate-y-0">
        <Button color="primary" variant="bordered" radius="full" onClick={() => {
            const lastBlock = editor.document[editor.document.length - 1];
            editor.insertBlocks([{ type: "pomodoro" }], lastBlock?.id || "", "after")
        }}>Pomodoro</Button>
        <Button color="primary" variant="bordered" radius="full" onClick={() => {
            const lastBlock = editor.document[editor.document.length - 1];
            editor.insertBlocks([{ type: "notebox", cards: ["Test"] }], lastBlock?.id || "", "after")
        }}>Note box</Button>
        <Button color="primary" variant="bordered" radius="full">Give three questions</Button>
        <Button color="primary" variant="bordered" radius="full">Give three questions</Button>
        <Button color="primary" variant="bordered" radius="full" className="col-start-2">Give three questions</Button>
        <Button color="primary" variant="bordered" radius="full">Give three questions</Button>
        {/* <Button color="primary" variant="bordered" radius="full">Give three questions</Button> */}
    </div>
}