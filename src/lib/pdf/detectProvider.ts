export type BankProvider =
  | 'phonepe'
  | 'hdfc'
  | 'icici'
  | 'sbi'
  | 'axis'
  | 'unknown';

interface ProviderPattern {
  keywords: string[];
  confidence: number;
}

const PROVIDER_PATTERNS: Record<BankProvider, string[]> = {
  phonepe: [
    'phonepe',
    'phone pe',
    'upi',
    'phonepay',
    'phonepay statement',
  ],
  hdfc: [
    'hdfc bank',
    'hdfc',
    'hdfc statement',
    'hdfc account',
  ],
  icici: [
    'icici bank',
    'icici',
    'icici statement',
    'icici account',
  ],
  sbi: [
    'state bank of india',
    'sbi',
    'sbi statement',
    'sbi account',
  ],
  axis: [
    'axis bank',
    'axis',
    'axis statement',
    'axis account',
  ],
  unknown: [],
};

export function detectProvider(
  text: string,
): { provider: BankProvider; confidence: number } {
  const textLower = text.toLowerCase();
  let maxScore = 0;
  let detectedProvider: BankProvider = 'unknown';

  for (const [provider, keywords] of Object.entries(
    PROVIDER_PATTERNS,
  )) {
    let score = 0;

    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        score += keyword.length; // Longer keywords = higher confidence
      }
    }

    if (score > maxScore) {
      maxScore = score;
      detectedProvider = provider as BankProvider;
    }
  }

  // Normalize confidence to 0-1 scale
  const confidence = Math.min(maxScore / 50, 1);

  return { provider: detectedProvider, confidence };
}
