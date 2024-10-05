import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TopicFormat = z.object({
    name: z.string(),
    overview: z.string(),
    learningObjective: z.string(),
    comprehensionQuestions: z.array(z.string()).describe("Questions that the reader should be able to answer after watching the video."),
    videoSearchQueries: z.array(z.string()).describe("YouTube optimized search queries that can find the best learning resources to watch that fulfils the learning objective."),
    tip: z.string().describe("A short tip that the reader should be able to use to improve their learning or perform the operation faster in a limited time situation."),
})
const StudyGuideFormat = z.object({
    title: z.string(),
    difficultyLevel: z.number().describe("How difficult the course is. 1 is very easy, 10 is very difficult."),
    motivationalMessage: z.string().describe("A short common saying that should give them the drive to study better."),
    chapters: z.array(z.object({
        title: z.string(),
        topics: z.array(TopicFormat),
    })),
});


export const studyGuideRouter = createTRPCRouter({
    generateStudyGuide: publicProcedure
        .input(z.object({
            courseOutline: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
            const { courseOutline } = input;

            try {
                // Use OpenAI to generate a structured study guide
                const completion = await openai.beta.chat.completions.parse({
                    model: "gpt-4o-2024-08-06",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that creates structured study guides based on course outlines. The input would be their course outline/syllabus and you are to convert that into a study guide. Your number 1 aim with the study guide is to make them learn 5x faster than their peers who didn't use the study guide." },
                        { role: "user", content: courseOutline },
                    ],
                    response_format: zodResponseFormat(StudyGuideFormat, "guide")
                });

                const result = completion?.choices[0]?.message.parsed

                // // Store the study guide in the database
                // const createdStudyGuide = await ctx.db.studyGuide.create({
                //     data: {
                //         courseOutline,
                //         guideSections: {
                //             create: studyGuide.topics.map((topic: any) => ({
                //                 title: topic.name,
                //                 content: topic.overview,
                //                 objective: topic.learningObjective,
                //             }))
                //         }
                //     },
                //     include: {
                //         guideSections: true
                //     }
                // });

                // // Return only the first 3 sections
                // return {
                //     id: createdStudyGuide.id,
                //     topics: createdStudyGuide.guideSections.slice(0, 3).map(section => ({
                //         name: section.title,
                //         overview: section.content,
                //         learningObjective: section.objective,
                //     }))
                // };

            } catch (error) {
                console.error("Error generating study guide:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate study guide",
                });
            }
        }),
});