import type { ParsedTransaction } from './phonepe';

export function parseSBIStatement(
  text: string,
): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split('\n');

  // SBI patterns - date format: DD/MM/YYYY
  const datePattern = /(\d{2}\/\d{2}\/\d{4})/;
  const amountPattern =
    /[₹]?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g;

  for (const line of lines) {
    if (!line.trim() || line.length < 15) continue;

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

    // SBI format typically has specific keywords
    const type =
      line.toLowerCase().includes('credit') ||
      line.toLowerCase().includes('deposit')
        ? 'income'
        : 'expense';

    const description = line
      .replace(datePattern, '')
      .replace(amountPattern, '')
      .replace(/^(Dr|Cr|CHQ)/, '')
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
