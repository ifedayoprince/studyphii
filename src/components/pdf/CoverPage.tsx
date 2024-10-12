import { Page, Text, View, StyleSheet,  Link, Svg, Path,Font } from '@react-pdf/renderer';


// Registering fonts globally
Font.register({
    family: 'Roboto',
    fonts: [
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf" }, // Roboto Regular
        { src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf", fontWeight: 'bold' }, // Roboto Bold
    ]
});
Font.registerHyphenationCallback(word => [word]);

// Define styles with adjustments
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0A0A23', // Dark navy background
    padding: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  appHeader: {
    position: 'absolute',
    top: 60, // Lowered a bit more
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  appName: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFC857', // Golden-yellow
  },
  appLink: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FFC857',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 36, // Bolder title
    textAlign: 'center',
    color: '#FFFFFF', // White color
    marginBottom: 10,
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: '#FFC857',
    marginVertical: 20,
  },
  motivationalMessage: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#BBBBBB', // Softened color
    marginTop: 20,
    paddingHorizontal: 10,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#3A86FF', // Blue top border
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#FF006E', // Pink bottom border
  },
  circleAccent: {
    position: 'absolute',
    top: 150, // Lowered the circle
    right: 40,
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: '#3A86FF', // Blue circular accent
  },
  triangleAccent: {
    position: 'absolute',
    bottom: 100, // Adjusted position for better balance
    left: 30,
    width: 80,
    height: 80,
  },
  greenAccent: {
    position: 'absolute',
    bottom: 40, // Positioned at the bottom
    left: '40%', // Centered horizontally
    width: 80,
    height: 20,
    backgroundColor: '#8AC926', // Greenish accent color
  },
});

// SVG Triangle Component for cleaner rendering
const TriangleAccent = () => (
  <Svg style={styles.triangleAccent} viewBox="0 0 100 100">
    <Path
      d="M 0 100 L 100 100 L 50 0 Z"
      fill="#FF006E"
      transform="rotate(45 50 50)" // Further rotated for more dynamic look
    />
  </Svg>
);

// CoverPage Component
const CoverPage = ({ data }: any) => (
    <Page style={styles.page}>
      {/* Decorative borders */}
      <View style={styles.borderTop}></View>
      <View style={styles.borderBottom}></View>

      {/* App name and URL */}
      <View style={styles.appHeader}>
        <Text style={styles.appName}>StudyPhii</Text>
        <Link src="https://study.phii.space" style={styles.appLink}>
          https://study.phii.space
        </Link>
      </View>

      {/* Title - Guide's Title */}
      <Text style={styles.title}>{data.title}</Text>

      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Geometric accents */}
      <View style={styles.circleAccent}></View>
      <TriangleAccent />
      <View style={styles.greenAccent}></View>

      {/* Motivational message */}
      <Text style={styles.motivationalMessage}>
        "{data.motivationalMessage}"
      </Text>
    </Page>
);

export default CoverPage;