import { Document } from '@react-pdf/renderer';
import CoverPage from './CoverPage';
import TableOfContentsPage from './TableOfContentsPage';
import ChapterPage from './ChapterPage';
import EndingPage from './EndingPage';

const PDFDocument = ({ data }: any) => {
    return (
        <Document author="StudyPhii" producer="StudyPhii Version 1.0" creator="StudyPhii (https://study.phii.space)" subject={data.title}>
            {/* Cover page */}
            <CoverPage data={data} />

            {/* Table of Contents */}
            <TableOfContentsPage data={data} />

            {/* Iterating through chapters and rendering ChapterPage */}
            {data.chapters.map((chapter: any, index: number) => (
                <ChapterPage key={index} chapterData={chapter} />
            ))}

            <EndingPage />
            
            {/* You can add more pages here as necessary */}
        </Document>
    );
};

export default PDFDocument;
