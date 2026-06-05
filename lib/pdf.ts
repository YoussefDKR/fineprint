export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  const text = data.text?.trim() ?? '';

  if (!text) {
    throw new Error('Could not extract text from PDF. The file may be scanned or image-based.');
  }

  return text;
}
