import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.PDF_TOKEN_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '15m'; // Token expires in 15 minutes

export function generatePdfToken(studyGuideId: string): string {
  return jwt.sign({ studyGuideId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

export function verifyPdfToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { studyGuideId: string };
    return decoded.studyGuideId;
  } catch (error) {
    return null;
  }
}