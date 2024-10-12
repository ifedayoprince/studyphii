import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';
// import mock from '@/server/data/mock-guide.json';
import { db } from "@/server/db";
import { env } from "@/env";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TopicFormat = z.object({
    name: z.string().describe("The title of the topic only, not prefixed with anything such as 'Topic 1' e.t.c, just the title."),
    overview: z.string(),
    learningObjective: z.string(),
    comprehensionQuestions: z.array(z.string()).describe("Questions that the reader should be able to answer after watching the video."),
    videoSearchQueries: z.array(z.string()).describe("YouTube optimized search queries that can find the best learning resources to watch that fulfils the learning objective."),
    tip: z.string().describe("A short tip that the reader should be able to use to improve their learning or perform the operation faster in a limited time situation."),
})
const StudyGuideFormat = z.object({
    title: z.string(),
    filename: z.string().describe("Name of the study guide without the extension"),
    difficultyLevel: z.number().describe("How difficult the course is. 1 is very easy, 10 is very difficult."),
    motivationalMessage: z.string().describe("A short common saying that should give them the drive to study the guide till the end."),
    chapters: z.array(z.object({
        title: z.string().describe("The title of the chapter only, not prefixed with anything such as 'Chapter 1' e.t.c, just the title."),
        topics: z.array(TopicFormat),
    })),
});

async function searchYouTubeVideos(query: string): Promise<string[]> {
    const apiKey = env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}&maxResults=10`;

    try {
        const response = await fetch(url, {
            headers: {
                'Referer': env.HOSTED_URL || ""
            }
        });
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items.map((item: any) => item.id.videoId);
        }
    } catch (error) {
        console.error("Error searching YouTube videos:", error);
    }

    return [];
}

interface TeaserChapter {
    title: string;
    topics: string[];
    video?: string;
}

export interface StudyGuideTeaser {
    title: string;
    chapters: TeaserChapter[];
}

function createTeaser(studyGuide: typeof StudyGuideFormat._type): StudyGuideTeaser {
    console.log(studyGuide);
    const teaserChapters: TeaserChapter[] = studyGuide.chapters.map(chapter => ({
        title: chapter.title,
        topics: chapter.topics.map(topic => topic.name),
        video: (chapter.topics[0] as any).videos[0] ?? undefined,
    }));

    return {
        title: studyGuide.title,
        chapters: teaserChapters,
    };
}

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
                if (!result)
                    throw new Error("Failed to generate study guide")
                console.log(JSON.stringify(result))

                // Set to keep track of unique video IDs
                const uniqueVideoIds = new Set<string>();

                // Search for YouTube videos for each topic
                for (const chapter of result.chapters) {
                    for (const topic of chapter.topics) {
                        const videoIds = await Promise.all(
                            topic.videoSearchQueries.map(query => searchYouTubeVideos(query))
                        );
                        (topic as any).videos = videoIds.flat().reduce((acc: string[], id) => {
                            if (!uniqueVideoIds.has(id) && acc.length < topic.videoSearchQueries.length) {
                                uniqueVideoIds.add(id);
                                acc.push(id);
                            }
                            return acc;
                        }, []);
                    }
                }
                console.log(uniqueVideoIds)

                // Store the study guide in the database
                const storedStudyGuide = await db.studyGuide.create({
                    data: {
                        courseOutline,
                        fileName: result.filename,
                        generatedFor: null,
                        isDownloaded: false,
                        title: result.title,
                        motivationalMessage: result.motivationalMessage,
                        difficultyLevel: result.difficultyLevel,
                        chapters: {
                            create: result.chapters.map(chapter => ({
                                title: chapter.title,
                                topics: {
                                    create: chapter.topics.map(topic => ({
                                        name: topic.name,
                                        learningObjective: topic.learningObjective,
                                        comprehensionQuestions: topic.comprehensionQuestions,
                                        videoSearchQueries: topic.videoSearchQueries,
                                        videos: {
                                            create: (topic as any).videos.map((videoId: string, index: number) => ({
                                                youtubeVideoId: videoId,
                                                searchQuery: topic.videoSearchQueries[index] ?? "",
                                            })),
                                        },
                                        overview: topic.overview,
                                        tip: topic.tip,
                                    })),
                                },
                            })),
                        },
                    },
                });

                // Create and return the teaser
                const teaser = createTeaser(result);

                return { teaser, id: storedStudyGuide.id };

            } catch (error) {
                console.error("Error generating study guide:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate study guide",
                });
            }
        }),
    checkPaymentStatus: publicProcedure
        .input(z.object({ studyGuideId: z.string() }))
        .query(async ({ ctx, input }) => {
            const studyGuide = await ctx.db.studyGuide.findUnique({
                where: { id: input.studyGuideId },
                select: { generatedFor: true }
            })

            if (!studyGuide) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Study guide not found',
                })
            }

            return { isPaid: studyGuide.generatedFor !== null }
        }),
});
