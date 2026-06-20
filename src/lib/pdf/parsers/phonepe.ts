export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  balance?: number;
  referenceId?: string;
}

export function parsePhonePeStatement(
  text: string,
): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split('\n');

  // PhonePe patterns
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
  const amountPattern =
    /[₹$]?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g;

  for (const line of lines) {
    if (!line.trim() || line.length < 10) continue;

    const dateMatch = line.match(datePattern);
    if (!dateMatch) continue;

    const date = dateMatch[1];
    const amounts = Array.from(
      line.matchAll(amountPattern),
    );

    if (amounts.length === 0) continue;

    const amount = parseFloat(
      amounts[0][1].replace(/,/g, ''),
    );

    const type =
      line.toLowerCase().includes('received') ||
      line.toLowerCase().includes('credit') ||
      line.toLowerCase().includes('paid to')
        ? 'income'
        : 'expense';

    const description = line
      .replace(datePattern, '')
      .replace(amountPattern, '')
      .trim();

    transactions.push({
      date,
      description,
      amount: Math.abs(amount),
      type,
      category: 'Other',
    });
  }

  return transactions;
}
