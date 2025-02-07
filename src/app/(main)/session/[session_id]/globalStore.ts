import { create } from "zustand";

interface IGlobalStore {
    refinePrompt: string;
    setRefinePrompt: (refinePrompt: string) => void;

    sessionQuestionsRefresher: () => Promise<void>;
    setSessionQuestionsRefresher: (refresher: () => Promise<void>)=> void;
}

export const useGlobalStore = create<IGlobalStore>((set) => ({
    refinePrompt: "",
    setRefinePrompt: (refinePrompt) => set({ refinePrompt }),

    sessionQuestionsRefresher: async ()=>{},
    setSessionQuestionsRefresher: (refresher)=> set({sessionQuestionsRefresher: refresher})
}));
