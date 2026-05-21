import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function fallbackCategory(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("zomato") || lower.includes("food")) return "Food";
  if (lower.includes("uber") || lower.includes("travel")) return "Travel";
  if (lower.includes("amazon") || lower.includes("shopping")) return "Shopping";

  return "Other";
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
You are a financial transaction classifier.

Your task:
- Categorize expense text into EXACTLY ONE category from this list:
Food
Travel
Shopping
Bills
Salary
Other

Rules:
- "Ola", "Uber", "Rapido", "Metro", "Bus", "Flight", "Taxi", "indrive" => Travel
- "Zomato", "Swiggy", "Restaurant", "Cafe", "Pizza", "Burger" => Food
- "Amazon", "Flipkart", "Myntra" => Shopping
- Electricity, water, recharge, internet => Bills
- salary, income, credited => Salary

IMPORTANT:
- Return ONLY the category name
- Do NOT explain
- Do NOT add punctuation
- Do NOT return sentences
- If unsure return Other
      `,
          },
          {
            role: "user",
            content: text,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0,
      });

      const category =
        completion.choices[0]?.message?.content?.trim() || "Other";

      const normalized =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

      return NextResponse.json({
        category: normalized,
      });
    } catch (err) {
      console.error("GROQ ERROR:", err);

      const category = fallbackCategory(text);

      return NextResponse.json({ category });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json({ category: "Other" });
  }
}
