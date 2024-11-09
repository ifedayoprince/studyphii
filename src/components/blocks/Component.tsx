import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import "./styles.css";
 

// The Alert block.
export const PomodoroTimer = createReactBlockSpec(
  {
    type: "pomodoro",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <div className="">
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  }
);
 