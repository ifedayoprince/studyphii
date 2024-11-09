"use client";

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Button, Card, CircularProgress } from "@nextui-org/react";
import { Timer1, Pause, Play, Stop, CloseCircle } from "iconsax-react";
import { useEffect, useId, useState } from "react";
import { create } from "zustand";
import { createPortal } from "react-dom";

const DURATIONS = {
  work: 0.5,
  break: 0.5,
} as const;

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  isDone: boolean;
  showBreakPrompt: boolean;
}

interface PomodoroState {
  timers: Record<string, TimerState>;
  activeTimerId: string | null;
}

interface PomodoroActions {
  setTimeLeft: (id: string, time: number) => void;
  setIsRunning: (id: string, isRunning: boolean) => void;
  setIsBreak: (id: string, isBreak: boolean) => void;
  setIsDone: (id: string, isDone: boolean) => void;
  setShowBreakPrompt: (id: string, show: boolean) => void;
  setActiveTimer: (id: string | null) => void;
  initializeTimer: (id: string) => void;
  reset: (id: string) => void;
}

const initialTimerState: TimerState = {
  timeLeft: DURATIONS.work * 60,
  isRunning: false,
  isBreak: false,
  isDone: false,
  showBreakPrompt: false,
};

const usePomodoroStore = create<PomodoroState & PomodoroActions>((set) => ({
  timers: {},
  activeTimerId: null,
  setTimeLeft: (id, time) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...state.timers[id] || initialTimerState, timeLeft: time }
      }
    })),
  setIsRunning: (id, isRunning) =>
    set((state) => {
      const updatedTimers = { ...state.timers };
      if (isRunning) {
        Object.keys(updatedTimers).forEach((timerId) => {
          if (timerId !== id && updatedTimers[timerId]) {
            updatedTimers[timerId] = { ...updatedTimers[timerId], isRunning: false };
          }
        });
      }
      updatedTimers[id] = { ...updatedTimers[id] || initialTimerState, isRunning };

      return {
        timers: updatedTimers,
        activeTimerId: isRunning ? id : null
      };
    }),
  setIsBreak: (id, isBreak) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...state.timers[id] || initialTimerState, isBreak }
      }
    })),
  setIsDone: (id, isDone) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...state.timers[id] || initialTimerState, isDone }
      }
    })),
  setShowBreakPrompt: (id, show) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...state.timers[id] || initialTimerState, showBreakPrompt: show }
      }
    })),
  setActiveTimer: (id) =>
    set({ activeTimerId: id }),
  initializeTimer: (id) =>
    set((state) => ({
      timers: { ...state.timers, [id]: { ...initialTimerState } }
    })),
  reset: (id) =>
    set((state) => ({
      timers: { ...state.timers, [id]: { ...initialTimerState } },
      activeTimerId: null
    })),
}));

function PomodoroContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const id = useId();
  const store = usePomodoroStore();

  useEffect(() => {
    store.initializeTimer(id);
    return () => {
      // Clean up this timer when component unmounts
      if (store.activeTimerId === id) {
        store.setActiveTimer(null);
      }
    };
  }, []);

  const state = store.timers[id] || initialTimerState;
  const { timeLeft, isRunning, isBreak, isDone, showBreakPrompt } = state;
  const isAnotherTimerActive = store.activeTimerId !== null && store.activeTimerId !== id;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        store.setTimeLeft(id, timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        store.setIsRunning(id, false);
        store.setShowBreakPrompt(id, true);
      } else {
        store.setIsDone(id, true);
        store.setIsRunning(id, false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, id]);

  const startBreak = () => {
    store.setIsBreak(id, true);
    store.setShowBreakPrompt(id, false);
    store.setTimeLeft(id, DURATIONS.break * 60);
    store.setIsRunning(id, true);
  };

  const resumeWork = () => {
    store.reset(id);
    store.setIsRunning(id, true);
  };

  const toggleTimer = () => {
    const willStart = !isRunning;
    store.setIsRunning(id, willStart);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = isBreak
    ? (timeLeft / (DURATIONS.break * 60)) * 100
    : (timeLeft / (DURATIONS.work * 60)) * 100;

  const getBgColor = () => {
    if (isBreak) return "bg-green-100 border-green-500";
    if (!isRunning) return "bg-orange-100 border-orange-500";
    return "bg-blue-100 border-blue-500";
  };

  const getProgressColor = () => {
    if (isBreak) return "success";
    if (!isRunning) return "warning";
    return "primary";
  };

  const FullscreenView = () => (
    createPortal(
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${getBgColor()}`}
      >
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsFullscreen(false)}
          className="absolute top-8 right-8"
        >
          <CloseCircle size={32} />
        </Button>

        <div className="relative w-80 h-80">
          <CircularProgress
            value={progress}
            color={getProgressColor()}
            showValueLabel={false}
            classNames={{
              svg: "w-full h-full",
              indicator: "transition-all duration-500 ease-linear stroke-[6px]",
              track: "stroke-[6px]",
            }}
          >
            <div className="flex items-center justify-center">
              <span className="text-7xl font-bold tracking-wider">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </CircularProgress>
        </div>

        <div className="flex items-center gap-6 mt-16">
          {showBreakPrompt ? (
            <Button
              color="success"
              variant="flat"
              size="lg"
              onPress={startBreak}
              className="text-xl px-8 py-6"
            >
              Take Break
            </Button>
          ) : isBreak ? (
            <Button
              color="primary"
              variant="flat"
              size="lg"
              onPress={resumeWork}
              className="text-xl px-8 py-6"
            >
              Resume Work
            </Button>
          ) : (
            <>
              <Button
                isIconOnly
                color={getProgressColor()}
                variant="flat"
                size="lg"
                onPress={toggleTimer}
                className="w-20 h-20"
              >
                {isRunning ? <Pause size={40} /> : <Play size={40} />}
              </Button>
              <Button
                isIconOnly
                color={getProgressColor()}
                variant="flat"
                size="lg"
                onPress={() => store.reset(id)}
                className="w-20 h-20"
              >
                <Stop size={40} />
              </Button>
            </>
          )}
        </div>
      </div>,
      document.body
    )
  );

  const InlineView = () => (
    <Card
      disableRipple
      isPressable
      radius="md"
      className={`w-full flex flex-row py-5 items-center justify-between relative transition-colors duration-500 ${getBgColor()} border px-6`}
      onClick={() => setIsFullscreen(true)}
    >
      <CircularProgress
        value={progress}
        color={getProgressColor()}
        showValueLabel={false}
        classNames={{
          svg: "w-20 h-20",
          indicator: "transition-all duration-500 ease-linear stroke-[4px]",
          track: "stroke-[4px]",
        }}
      />

      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold tracking-wider">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-xs text-default-500 font-medium">
          {isBreak ? `Break Time (${DURATIONS.break}min)` : `Focus Time (${DURATIONS.work}min)`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {showBreakPrompt ? (
          <Button
            color="success"
            variant="flat"
            size="md"
            onPress={startBreak}
          >
            Take Break
          </Button>
        ) : isBreak ? (
          <Button
            color="primary"
            variant="flat"
            size="md"
            onPress={resumeWork}
          >
            Resume Work
          </Button>
        ) : (
          <>
            <Button
              isIconOnly
              color={getProgressColor()}
              variant="flat"
              size="md"
              onPress={toggleTimer}
              className="min-w-12"
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              isIconOnly
              color={getProgressColor()}
              variant="flat"
              size="md"
              onPress={() => store.reset(id)}
              className="min-w-12"
            >
              <Stop size={20} />
            </Button>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <>
      <InlineView />
      {isFullscreen && <FullscreenView />}
    </>
  );
}

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
    render: () => <PomodoroContent />,
  }
);
