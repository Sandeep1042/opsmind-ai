import fs from "fs";
import { PDFParse } from "pdf-parse";
import { chunkText } from "./chunker.js";

/**
 * Parse PDF and chunk it into pieces of ~1000 characters
 */
export async function parseAndChunkPDF(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: fileBuffer });
  const data = await parser.getText();

  console.log("📑 Total Pages:", data.total);

  const fullText = data.text.replace(/\n\s*\n/g, "\n");
  const chunks = chunkText(fullText, 1000, 200);

  console.log(`✅ Created ${chunks.length} chunks`);
  return chunks;
}
