import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function fallbackInsights(transactions: any[]) {
  const expenses = transactions.filter((t) => t.type === "expense");

  if (expenses.length === 0) {
    return "No expense data available yet.";
  }

  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const grouped = expenses.reduce((acc: any, curr: any) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);

    return acc;
  }, {});

  const topCategory = Object.entries(grouped).sort(
    (a: any, b: any) => b[1] - a[1],
  )[0]?.[0];

  return `Your total expenses are ₹${totalExpense}. Most spending happened in ${topCategory}.`;
}

export async function POST(req: Request) {
  try {
    const { transactions } = await req.json();

    if (!transactions?.length) {
      return NextResponse.json({
        insight: "No transactions available.",
      });
    }

    try {
      const prompt = `
You are a financial assistant.

Analyze these transactions and provide:
- spending patterns
- unusual expenses
- savings advice

Keep response short and practical.

Transactions:
${JSON.stringify(transactions)}
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.5,
      });

      const insight = completion.choices[0]?.message?.content;

      return NextResponse.json({
        insight: insight || fallbackInsights(transactions),
      });
    } catch (err) {
      console.log("Groq failed → using fallback");

      return NextResponse.json({
        insight: fallbackInsights(transactions),
      });
    }
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      insight: "Unable to generate insights.",
    });
  }
}
