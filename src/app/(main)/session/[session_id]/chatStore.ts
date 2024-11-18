import { create } from "zustand";
import { Message } from "@/server/api/routers/messages";

interface MessageState {
  messages: Message[];
  pendingMessages: Map<string, Message>;
  isTyping: boolean;
  hasStarted: boolean;
}

interface ChatState {
  messageStates: Map<string, MessageState>;
  error: string | null;
  initQuestionState: (questionId: string) => void;
  getQuestionState: (questionId: string) => MessageState;
  setMessages: (questionId: string, messages: Message[]) => void;
  addMessage: (questionId: string, message: Message) => void;
  addPendingMessage: (questionId: string, id: string, message: Message) => void;
  removePendingMessage: (questionId: string, id: string) => void;
  setIsTyping: (questionId: string, isTyping: boolean) => void;
  setHasStarted: (questionId: string, hasStarted: boolean) => void;
  setError: (error: string | null) => void;
  reset: (questionId: string) => void;
}

const createInitialMessageState = (): MessageState => ({
  messages: [],
  pendingMessages: new Map(),
  isTyping: false,
  hasStarted: false,
});

export const useChatStore = create<ChatState>((set, get) => ({
  messageStates: new Map(),
  error: null,

  initQuestionState: (questionId) => {
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      if (!newMessageStates.has(questionId)) {
        newMessageStates.set(questionId, createInitialMessageState());
      }
      return { messageStates: newMessageStates };
    });
  },

  getQuestionState: (questionId) => {
    const state = get().messageStates.get(questionId);
    if (!state) {
      get().initQuestionState(questionId);
      return get().messageStates.get(questionId)!;
    }
    return state;
  },

  setMessages: (questionId, messages) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      newMessageStates.set(questionId, {
        ...questionState,
        messages,
      });
      return { messageStates: newMessageStates };
    }),

  addMessage: (questionId, message) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      newMessageStates.set(questionId, {
        ...questionState,
        messages: [...questionState.messages, message],
      });
      return { messageStates: newMessageStates };
    }),

  addPendingMessage: (questionId, id, message) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      const newPendingMessages = new Map(questionState.pendingMessages);
      newPendingMessages.set(id, message);
      newMessageStates.set(questionId, {
        ...questionState,
        pendingMessages: newPendingMessages,
      });
      return { messageStates: newMessageStates };
    }),

  removePendingMessage: (questionId, id) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      const newPendingMessages = new Map(questionState.pendingMessages);
      newPendingMessages.delete(id);
      newMessageStates.set(questionId, {
        ...questionState,
        pendingMessages: newPendingMessages,
      });
      return { messageStates: newMessageStates };
    }),

  setIsTyping: (questionId, isTyping) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      newMessageStates.set(questionId, {
        ...questionState,
        isTyping,
      });
      return { messageStates: newMessageStates };
    }),

  setHasStarted: (questionId, hasStarted) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      const questionState = newMessageStates.get(questionId) || createInitialMessageState();
      newMessageStates.set(questionId, {
        ...questionState,
        hasStarted,
      });
      return { messageStates: newMessageStates };
    }),

  setError: (error) => set({ error }),

  reset: (questionId) =>
    set((state) => {
      const newMessageStates = new Map(state.messageStates);
      newMessageStates.set(questionId, createInitialMessageState());
      return { messageStates: newMessageStates, error: null };
    }),
}));
