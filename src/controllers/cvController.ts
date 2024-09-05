import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { Request, Response } from "express";
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
