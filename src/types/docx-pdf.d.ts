declare module "docx-pdf" {
  export function toPdf(inputPath: string, outputPath: string): Promise<void>;
}
