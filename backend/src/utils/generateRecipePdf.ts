import { RecipeDocument } from "../models/recipe.model";
import fs from "fs";
import PDFDocument from "pdfkit";
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { BUCKET_NAME } from "../config/env.config";
import { PassThrough } from "stream";
import streamBuffers from "stream-buffers";
import { s3 } from "../config/s3.config";

export const generateRecipePdf = async (
  recipeData: RecipeDocument
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Create a writable buffer stream
      const bufferStream = new streamBuffers.WritableStreamBuffer({
        initialSize: 100 * 1024, // Start at 100KB
        incrementAmount: 10 * 1024, // Increase by 10KB as needed
      });

      // Pipe PDF output into the buffer stream
      doc.pipe(bufferStream);

      // Title and Total Time Alignment
      doc.fontSize(18).font("Helvetica-Bold");
      doc.text(recipeData.title, { continued: true });
      doc.text(` ${recipeData.totalTime}`, { align: "right" });

      // Serving Size
      doc
        .moveDown()
        .fontSize(12)
        .font("Helvetica")
        .text(`Serving Size: ${recipeData.servingSize}`)
        .moveDown();

      // Description
      doc.text(recipeData.description).moveDown();

      // Ingredients
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Ingredients:")
        .moveDown(0.5);
      doc.font("Helvetica");
      recipeData.ingredients.forEach((ingredient) => {
        doc.text(`- ${ingredient.quantity} ${ingredient.name}`).moveDown(0.25);
      });

      // Steps
      doc
        .moveDown()
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Steps:")
        .moveDown(0.5);
      doc.font("Helvetica");
      recipeData.steps.forEach((step, index) => {
        doc.text(`${index + 1}. ${step}`).moveDown(0.5);
      });

      // Finalize PDF
      doc.end();

      // Wait for the PDF to be fully written to the buffer
      bufferStream.on("finish", async () => {
        const pdfBuffer = bufferStream.getContents();

        if (!pdfBuffer) {
          return reject(new Error("Failed to generate PDF buffer"));
        }

        // Define S3 file path
        const fileKey = `recipes/${recipeData._id}.pdf`;

        // Upload PDF to S3 with public-read ACL
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: fileKey,
          Body: pdfBuffer,
          ContentType: "application/pdf",
          ContentLength: pdfBuffer.length,
        };

        try {
          await s3.send(new PutObjectCommand(uploadParams));

          // Construct the permanent public URL
          const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

          resolve(publicUrl);
        } catch (uploadError) {
          reject(uploadError);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
