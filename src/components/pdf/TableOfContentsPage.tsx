import { Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registering fonts globally
Font.register({
    family: 'Roboto',
    fonts: [
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf" }, // Roboto Regular
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf", fontWeight: 'bold' }, // Roboto Bold
    ]
});
Font.registerHyphenationCallback(word => [word]);

// Define styles for the ToC page
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#f4f7fb', // Lighter background for modern look
    border: '10px solid #2b6cb0', // Dark blue border for a sleek look
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2d3748', // Slightly darker for modern feel
    letterSpacing: 1.2, // Spacing to give it an airy feel
  },
  chapter: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#3182ce', // Normal blue for chapter title
    paddingBottom: 5,
    borderBottom: '1px solid #ddd', // Subtle underline
  },
  topicContainer: {
    marginLeft: 20, // Create padding to indent topics under chapters
    marginTop: 10,
  },
  topic: {
    fontSize: 13,
    color: '#4a5568', // Softer gray for topics
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: 10,
    marginRight: 5,
    color: '#805ad5', // Purple for bullet points
  },
});

const TableOfContentsPage = ({ data }: any) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Title of the guide */}
      <Text style={styles.title}>Table of Contents</Text>

      {/* Iterating through chapters */}
      {data.chapters.map((chapter: any, index: number) => (
        <View key={index}>
          {/* Chapter Title */}
          <Text style={styles.chapter}>
            {index + 1}. {chapter.title}
          </Text>

          {/* Iterating through topics */}
          <View style={styles.topicContainer}>
            {chapter.topics.map((topic: any, topicIndex: number) => (
              <View style={styles.topic} key={topicIndex}>
                <Text style={styles.bullet}>•</Text>
                <Text>
                  {index + 1}.{topicIndex + 1} {topic.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Page>
  );
};

export default TableOfContentsPage;
