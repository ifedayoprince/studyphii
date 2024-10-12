import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { renderToBuffer } from "@react-pdf/renderer";
import PDFDocument from "@/components/pdf/PDFDocument";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const pdfRouter = createTRPCRouter({
  generatePDF: publicProcedure
    .input(z.object({
      studyGuideId: z.string(),
      email: z.string().email()
    }))
    .mutation(async ({ ctx, input }) => {
      // Fetch the study guide from the database
      const studyGuide = await db.studyGuide.findUnique({
        where: { id: input.studyGuideId },
        include: { chapters: { include: { topics: { include: { videos: true } } } } },
      });

      if (!studyGuide) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Study guide not found",
        });
      }

      // Update the study guide with the user's email
      await db.studyGuide.update({
        where: { id: input.studyGuideId },
        data: { generatedFor: input.email, isDownloaded: true },
      });

      // Render the PDF
      const pdfBuffer = await renderToBuffer(<PDFDocument data={studyGuide} />);

      // Generate a filename
      const filename = `StudyPhii-${studyGuide.fileName.replace(/\s+/g, '-')}.pdf`;

      return {
        pdf: pdfBuffer.toString('base64'),
        filename,
      };
    }),
});
