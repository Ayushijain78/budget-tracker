import { extractPdfText } from "@/utils/pdfExtractor";
import { parsePhonePeTransactions } from "@/utils/phonepeParser";
import { useState } from "react";
interface Props {
  setParsedTransactions: (data: any[]) => void;
  setShowPreview: (show: boolean) => void;
}
export default function PhonePePDFUpload({setParsedTransactions, setShowPreview}:Props) {
   
  const handleUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  try {
    const file = e.target.files?.[0];

    if (!file) return;

    const text = await extractPdfText(file);

    const transactions =
      parsePhonePeTransactions(text);

    console.log("TRANSACTIONS");
    console.table(transactions);

    setParsedTransactions(transactions);
    setShowPreview(true);
  } catch (error) {
    console.error("PDF EXTRACTION ERROR:", error);
  }
};
  return <input type="file" accept=".pdf" onChange={handleUpload} />;
}
