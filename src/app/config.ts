import { type Metadata } from "next";


export const metadata: Metadata = {
    title: 'StudyPhii — Study Guide Generator',
    description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips..',
    icons: [{ rel: "icon", url: "./favicon.ico" }],
    openGraph: {
        url: 'https://study.phii.space',
        type: 'website',
        title: 'StudyPhii — Study Guide Generator',
        description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips.',
        images: [
            {
                url: './og.png',
                width: 1200,
                height: 630,
                alt: 'StudyPhii OpenGraph Image'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'StudyPhii — Study Guide Generator',
        description: 'StudyPhii is a platform that builds a detailed study guide from your course outline. The guides are complete with YouTube videos, comprehension tests and study tips.',
        images: [
            {
                url: './og.png',
                alt: 'StudyPhii Twitter Image'
            }
        ]
    }
};