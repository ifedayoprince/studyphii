import { type Topic } from '@prisma/client';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Register a custom font (you'll need to add this font file to your project)
// Font.register({
//   family: 'Roboto',
//   src: 'http://localhost:3002/Roboto-Regular.ttf',
// });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        backgroundColor: '#f8fafc',
    },
    section: {
        margin: 15,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: 32,
        marginBottom: 15,
        color: '#1e40af', // Indigo-800
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#475569', // Slate-600
        textAlign: 'center',
    },
    chapterTitle: {
        fontSize: 24,
        marginTop: 25,
        marginBottom: 15,
        color: '#3b82f6', // Blue-500
        borderBottom: '1 solid #3b82f6',
        paddingBottom: 8,
    },
    topicTitle: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        color: '#2563eb', // Blue-600
        fontWeight: 'bold',
    },
    text: {
        marginBottom: 10,
        color: '#334155', // Slate-700
        lineHeight: 1.6,
    },
    list: {
        marginLeft: 25,
        marginBottom: 15,
    },
    listItem: {
        marginBottom: 8,
    },
    tip: {
        backgroundColor: '#e0f2fe', // Sky-100
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    tipText: {
        color: '#0369a1', // Sky-700
        fontStyle: 'italic',
    },
    videoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 15,
        marginBottom: 20,
    },
    videoThumbnail: {
        width: '30%',
        marginRight: '3%',
        marginBottom: 15,
        position: 'relative',
    },
    thumbnailImage: {
        width: '100%',
        aspectRatio: '16 / 9',
        objectFit: 'cover',
    },
    videoTitle: {
        fontSize: 10,
        color: '#3b82f6', // Blue-500
        marginTop: 5,
        textAlign: 'center',
    },
    videoQuery: {
        width: '30%',
        marginRight: '3%',
        marginBottom: 15,
        color: '#3b82f6', // Blue-500
        fontSize: 10,
    },
});

const coverStyles = StyleSheet.create({
    page: {
        backgroundColor: '#1a202c', // Dark background
        padding: 40,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center',
    },
});

interface StudyGuidePDFProps {
    studyGuide: any;
}

export function StudyGuidePDF({ studyGuide }: StudyGuidePDFProps) {
    return (
        <Document>
            {/* Cover Page */}
            <Page size="A4" style={coverStyles.page}>
                <View style={coverStyles.header}>
                    <Image
                        style={coverStyles.logo}
                        src="/path/to/your/logo.png" // Replace with actual logo path
                    />
                    <Text style={coverStyles.title}>{studyGuide.title.toUpperCase()}</Text>
                    <Text style={coverStyles.subtitle}>STUDY GUIDE</Text>
                </View>
                <View style={coverStyles.footer}>
                    <Text style={coverStyles.footerText}>StudySpace</Text>
                    <Text style={coverStyles.footerText}>https://study.space</Text>
                </View>
            </Page>

            {/* Existing content page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>{studyGuide.title}</Text>
                    <Text style={styles.subtitle}>Difficulty Level: {studyGuide.difficultyLevel}/10</Text>
                    <Text style={styles.text}>{studyGuide.motivationalMessage}</Text>
                </View>

                {studyGuide.chapters.map((chapter: any, i: number) => (
                    <View key={i} style={styles.section}>
                        <Text style={styles.chapterTitle}>{chapter.title}</Text>
                        {chapter.topics.map((topic: Topic, j: number) => (
                            <View key={j}>
                                <Text style={styles.topicTitle}>{topic.name}</Text>
                                <Text style={styles.text}>Overview: {topic.overview}</Text>
                                <Text style={styles.text}>Learning Objective: {topic.learningObjective}</Text>
                                <Text style={styles.text}>Comprehension Questions:</Text>
                                <View style={styles.list}>
                                    {topic.comprehensionQuestions.map((question: string, k: number) => (
                                        <Text key={k} style={styles.listItem}>• {question}</Text>
                                    ))}
                                </View>
                                <Text style={styles.text}>Recommended Videos:</Text>
                                <View style={styles.videoGrid}>
                                    {topic.videoSearchQueries.map((query: string, l: number) => (
                                        <Link
                                            key={l}
                                            style={styles.videoThumbnail}
                                            src={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                                        >
                                            <Image
                                                style={styles.thumbnailImage}
                                                src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"
                                            />
                                            <Text style={styles.videoTitle}>{query}</Text>
                                        </Link>
                                    ))}
                                </View>
                                <View style={styles.tip}>
                                    <Text style={styles.tipText}>Tip: {topic.tip}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
}