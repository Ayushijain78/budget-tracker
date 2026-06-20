import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

 
const pdf = new PDFParse({
  data: buffer,
  disableWorker: true,
} as any);
  console.log("OPTIONS");
  console.log(pdf.options);

  return NextResponse.json({
    success: true,
    options: pdf.options,
  });
}