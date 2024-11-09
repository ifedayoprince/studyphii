"use client";

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Card } from "@nextui-org/react";


function NoteboxContent() {
  return <Card>
    </Card>
}

export const Notebox = createReactBlockSpec(
  {
    type: "notebox",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor
    },
    content: "none"
  },
  {
    render: () => <NoteboxContent />,
  }
);
