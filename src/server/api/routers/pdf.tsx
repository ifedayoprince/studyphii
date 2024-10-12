import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { renderToBuffer } from "@react-pdf/renderer";
import PDFDocument from "@/components/pdf/PDFDocument";
import guide from "@/server/data/mock-guide.json";

export const pdfRouter = createTRPCRouter({
  generatePDF: publicProcedure
    .input(z.object({ studyGuideId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      
    

      const pdfBuffer = await renderToBuffer(<PDFDocument data={guide} />);
      // const pdfBuffer = "dsd";
      return {
        pdf: pdfBuffer.toString('base64'),
        filename: `study-guide-${input.studyGuideId}.pdf`,
      };
    }),
});
