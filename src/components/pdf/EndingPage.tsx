import { Page, Text, View, StyleSheet, Link, Svg, Path, Font } from '@react-pdf/renderer';

// Registering fonts globally
Font.register({
  family: 'Roboto',
  fonts: [
    { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf" }, // Roboto Regular
    { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf", fontWeight: 'bold' }, // Roboto Bold
  ],
});
Font.registerHyphenationCallback(word => [word]);

// Define styles for the ending page
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0A0A23', // Dark navy background
    padding: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 32, // Slightly smaller than cover page title
    textAlign: 'center',
    color: '#FFFFFF', // White color
    marginBottom: 20,
  },
  divider: {
    width: '50%',
    height: 2,
    backgroundColor: '#FFC857', // Golden-yellow
    marginVertical: 20,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#BBBBBB', // Softer color for text
    textAlign: 'center',
    marginVertical: 20,
  },
  generateButton: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    textDecoration: "none",
    backgroundColor: '#FF006E', // Blue background for the button
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  appLink: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FFC857',
    marginTop: 30,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#3A86FF',
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#FF006E',
  },
  circleAccent: {
    position: 'absolute',
    top: 100,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#3A86FF',
  },
  triangleAccent: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    width: 80,
    height: 80,
  },
});

// SVG Triangle Component for cleaner rendering
const TriangleAccent = () => (
  <Svg style={styles.triangleAccent} viewBox="0 0 100 100">
    <Path
      d="M 0 100 L 100 100 L 50 0 Z"
      fill="#FF006E"
      transform="rotate(45 50 50)"
    />
  </Svg>
);

// EndingPage Component
const EndingPage = () => (
  <Page style={styles.page}>
    {/* Decorative borders */}
    <View style={styles.borderTop}></View>
    <View style={styles.borderBottom}></View>

    {/* Geometric accents */}
    <View style={styles.circleAccent}></View>
    <TriangleAccent />

    {/* Title */}
    <Text style={styles.title}>Need a detailed study guide{"\n"} like this?</Text>

    {/* Divider */}
    <View style={styles.divider}></View>

    {/* Message */}
    <Text style={styles.message}>
      Generate one from your course outline/syllabus{"\n"} with StudyPhii.
    </Text>

    {/* Generate button */}
    <Link src="https://study.phii.space" style={styles.generateButton}>
      Generate My Study Guide
    </Link>
  </Page>
);

export default EndingPage;
