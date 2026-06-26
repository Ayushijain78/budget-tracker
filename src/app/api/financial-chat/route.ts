import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Please ask a question." });
    }

    // Get token from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ reply: "Not authenticated." }, { status: 401 });
    }

    // Create Supabase client with user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ reply: "Not authenticated." }, { status: 401 });
    }

    // Fetch their transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(100);

    const prompt = `
You are a smart financial advisor.
Analyze the user's spending data and answer naturally.

Transactions (${transactions?.length ?? 0} total):
${transactions?.length ? JSON.stringify(transactions, null, 2) : "No transactions found."}

User Question: ${message}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "Unable to generate response.";
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("[financial-chat]", err);
    return NextResponse.json({ reply: "Something went wrong." }, { status: 500 });
  }
}