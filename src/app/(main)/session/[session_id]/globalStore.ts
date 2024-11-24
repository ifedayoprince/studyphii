import { create } from "zustand";

interface IGlobalStore {
    refinePrompt: string;
    setRefinePrompt: (refinePrompt: string) => void;

    sessionQuestionsRefresher: Function;
    setSessionQuestionsRefresher: (refresher: Function)=> void;
}

export const useGlobalStore = create<IGlobalStore>((set) => ({
    refinePrompt: "",
    setRefinePrompt: (refinePrompt) => set({ refinePrompt }),

    sessionQuestionsRefresher: ()=>{},
    setSessionQuestionsRefresher: (refresher)=> set({sessionQuestionsRefresher: refresher})
}));
