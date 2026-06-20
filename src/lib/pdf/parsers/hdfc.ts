import type { ParsedTransaction } from './phonepe';

export function parseHDFCStatement(
  text: string,
): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split('\n');

  // HDFC patterns - typically has date, reference, description, amount
  const datePattern = /(\d{1,2}-[A-Za-z]{3}-\d{2})/;
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

    // HDFC typically shows debit and credit separately
    const hasDebit =
      line.toLowerCase().includes('debit') ||
      line.toLowerCase().includes('dr');
    const hasCredit =
      line.toLowerCase().includes('credit') ||
      line.toLowerCase().includes('cr');

    const amount = parseFloat(
      amounts[0][1].replace(/,/g, ''),
    );

    const type =
      hasCredit || amounts[amounts.length - 1]
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
