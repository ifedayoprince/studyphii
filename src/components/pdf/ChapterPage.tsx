import { Page, Text, View, Image, Link, StyleSheet, Font } from '@react-pdf/renderer';

// Registering fonts globally
Font.register({
    family: 'Roboto',
    fonts: [
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf" }, // Roboto Regular
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf", fontWeight: 'bold' }, // Roboto Bold
    ]
});
Font.registerHyphenationCallback(word => [word]);
Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

// Constants for style values
const BORDER_COLOR = '#800080';
const TITLE_BG_COLOR = '#0056b3';
const BORDER_RADIUS = 8;
const FONT_SIZE_SMALL = 10;
const FONT_SIZE_MEDIUM = 12;
const FONT_SIZE_LARGE = 18;
const FONT_SIZE_TITLE = 24;
const TIP_BG_COLOR = '#e6ffe6';
const TIP_BORDER_COLOR = '#4CAF50';
const THUMBNAIL_ASPECT_RATIO = 9 / 16; // 16:9 aspect ratio

// Define styles for the Chapter page
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#f4f4f9',
        border: `2px solid ${BORDER_COLOR}`,
        position: 'relative',
    },
    chapterTitle: {
        fontSize: FONT_SIZE_TITLE,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: TITLE_BG_COLOR,
        padding: '40px 20px 20px 20px',
        marginBottom: 20,
        position: 'relative',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    content: {
        fontSize: FONT_SIZE_MEDIUM,
        color: '#333',
        lineHeight: 1.5,
    },
    topicTitle: {
        fontSize: FONT_SIZE_LARGE,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
        color: '#333',
    },
    learningObjective: {
        fontSize: FONT_SIZE_MEDIUM,
        fontStyle: 'italic',
        marginBottom: 10,
        color: '#666',
    },
    videoContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    videoThumbnail: {
        width: '150px', // Fixed width
        height: `${150 * THUMBNAIL_ASPECT_RATIO}px`, // 16:9 aspect ratio
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 6,
    },
    tipCard: {
        backgroundColor: TIP_BG_COLOR,
        border: `1px solid ${TIP_BORDER_COLOR}`,
        borderRadius: BORDER_RADIUS,
        padding: 5,
        marginTop: 15,
        marginBottom: 15,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    tipText: {
        fontSize: FONT_SIZE_SMALL,
        color: '#333',
        fontStyle: 'italic',
    },
    comprehensionContainer: {
        border: '1px solid #ccc',
        borderRadius: BORDER_RADIUS,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    comprehensionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    comprehensionQuestion: {
        fontSize: FONT_SIZE_MEDIUM,
        color: '#333',
        marginBottom: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 6,
    },
});

const ChapterPage = ({ chapterData }: any) => {
    return (
        <Page size="A4" style={styles.page}>
            {/* Chapter Title */}
            <Text style={styles.chapterTitle}>{chapterData.title}</Text>

            {/* Chapter Content */}
            <View style={styles.content}>
                {chapterData.topics.map((topic: any, index: number) => (
                    <View key={index}>
                        {/* Topic Title */}
                        <Text style={styles.topicTitle}>{`${index + 1}. ${topic.name}`}</Text>

                        {/* Topic Overview */}
                        <Text style={styles.content}>{topic.overview}</Text>

                        {/* Learning Objective */}
                        <Text style={styles.learningObjective}>Objective: {topic.learningObjective}</Text>

                        {/* Video Thumbnails with Clickable Links */}
                        <View style={styles.videoContainer}>
                            {topic.videos.map((video: any, videoIndex: number) => (
                                <Link
                                    key={videoIndex}
                                    src={`https://www.youtube.com/watch?v=${video}`} // Link to the YouTube video
                                >
                                    <Image
                                        style={styles.videoThumbnail}
                                        src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`} // Thumbnail image
                                    />
                                </Link>
                            ))}
                        </View>

                        {/* Tip Card */}
                        <View style={styles.tipCard}>
                            <Text style={styles.tipText}>&nbsp;💡&nbsp;&nbsp;{`${topic.tip}`}</Text>
                        </View>

                        {/* Comprehension Questions */}
                        <View style={styles.comprehensionContainer}>
                            <Text style={styles.comprehensionTitle}>
                                &nbsp;🧠&nbsp;&nbsp; Comprehension
                            </Text>
                            {topic.comprehensionQuestions.map((question: any, questionIndex: number) => (
                                <View key={questionIndex}>
                                    <Text style={styles.comprehensionQuestion}>{question}</Text>
                                    {questionIndex < topic.comprehensionQuestions.length - 1 && (
                                        <View style={styles.divider} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    );
};

export default ChapterPage;
