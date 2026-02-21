import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse-fixed");
import fs from "fs";

export const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdf = await pdfParse(dataBuffer);   // <-- WORKS NOW
  return pdf.text;
};
