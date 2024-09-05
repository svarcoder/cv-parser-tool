import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { Request, Response } from "express";
import mammoth from "mammoth";
const toPdf = require("docx-pdf");

export const generateCV = async (req: Request, res: Response) => {
  const { name, company, position, sender } = req.body;

  const templatePath = path.resolve(__dirname, "../templates/template.docx");
  const outputDocxPath = path.resolve(__dirname, `../output/${name}_cv.docx`);
  const outputPdfPath = path.resolve(__dirname, `../output/${name}_cv.pdf`);

  try {
    const templateContent = fs.readFileSync(templatePath, "binary");

    const template = handlebars.compile(templateContent);

    const filledContent = template({ name, company, position, sender });

    fs.writeFileSync(outputDocxPath, filledContent, "binary");
    console.log("DOCX generated successfully.");

    await toPdf(outputDocxPath, outputPdfPath);
    console.log("PDF generated successfully.");
    return res.status(201).json({
      status: 201,
      message: "PDF generated successfully",
      data: outputPdfPath,
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return res.status(404).json({
      status: 404,
      messege: error?.message,
    });
  }
};

export const extractTextFromCV = async (req: Request, res: Response) => {
  try {
    const cvFile = req.file;

    if (!cvFile) {
      return res.status(400).json({
        status: 404,
        messege: "No CV file uploaded.",
      });
    }

    const filePath = path.resolve(__dirname, "../uploads", cvFile.originalname);

    fs.writeFileSync(filePath, cvFile.buffer);

    const result = await mammoth.extractRawText({ path: filePath });
    console.log(result);

    let extractedText = result.value;

    extractedText = extractedText.replace(/\n+/g, " ").trim();
    extractedText = extractedText.replace(/\n+/g, "\n").trim();

    fs.unlinkSync(filePath);

    return res.status(201).json({
      status: 201,
      message: "Text generated successfully",
      data: extractedText,
    });
  } catch (error: any) {
    console.error("Error extracting text from CV:", error);
    return res.status(404).json({
      status: 404,
      messege: error?.message,
    });
  }
};
