import { QuestionType } from "@prisma/client";

export const mockQuestions = [{
    question: "There are {{slot}} countries in Africa",
    type: QuestionType.FILL_IN_BLANKS,
    answer: "54",
    options: [],
    isCorrect: 1,
    showExplanation: false,
    explanation: "",
    showActions: false
}, {
    question: "Briefly summarize the French Revolution",
    type: QuestionType.SUBJECTIVE,
    answer: "During the French Revolution...",
    options: [],
    isCorrect: 1,
    showExplanation: true,
    explanation: "",
    showActions: false
}, {
    question: "The eccentricity of a circle is",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: "0",
    options: [
        "0", "Less than 1", "1", "Greater than 1"
    ],
    isCorrect: 1,
    showExplanation: false,
    explanation: "",
    showActions: false
}, {
    question: "Mitochondria is the {{slot}} of the cell",
    type: QuestionType.FILL_IN_BLANKS,
    answer: "location",
    options: [],
    isCorrect: 2,
    showExplanation: true,
    explanation: "Mitochondria is the **powerhouse** of the cell",
    showActions: true
}]