import { categorizeTransaction } from "./categorizeTransaction";

export interface ParsedTransaction {
  date: string;
  note: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export function parsePhonePeTransactions(
  text: string,
): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  const regex =
    /(Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar)\s+\d{2},\s+\d{4}[\s\S]*?(Debit|Credit)\s+INR\s+([\d,.]+)/g;

  const matches = text.matchAll(regex);

  for (const match of matches) {
    const block = match[0];

    const amount = Number(
      match[3].replace(/,/g, ""),
    );

    const type =
      match[2] === "Credit"
        ? "income"
        : "expense";

    let note = "Other";

    const paidToMatch =
      block.match(/Paid to (.+?) Transaction ID/i);

    const receivedFromMatch =
      block.match(
        /Received from (.+?) Transaction ID/i,
      );

    if (paidToMatch) {
      note = paidToMatch[1].trim();
    }

    if (receivedFromMatch) {
      note = receivedFromMatch[1].trim();
    }

    const dateMatch = block.match(
      /([A-Za-z]{3}\s+\d{2},\s+\d{4})/,
    );

    transactions.push({
      date: dateMatch?.[1] || "",
      note,
      amount,
      type,
      category: categorizeTransaction(note),
    });
  }

  return transactions;
}