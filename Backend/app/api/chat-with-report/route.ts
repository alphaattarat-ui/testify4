// app/api/chat-with-report/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // FIX: Access environment variables directly from process.env
    const YTL_API_KEY = process.env.YTL_API_KEY;
    const YTL_API_URL = process.env.YTL_API_URL;
    const YTL_MODEL = process.env.YTL_MODEL;

    if (!YTL_API_KEY || !YTL_API_URL || !YTL_MODEL) {
      return NextResponse.json({ error: "YTL API configuration is missing." }, { status: 500 });
    }

    const { question, report } = await req.json();

    const prompt = `
You are an expert AI coach. The user has just completed a training session and received the following performance report.
Based on the report, answer the user's follow-up question. Be encouraging, constructive, and provide actionable advice.

Performance Report:
---
${report}
---

User's Question:
${question}
`;

    const ytlApiResponse = await fetch(YTL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YTL_API_KEY}`,
      },
      body: JSON.stringify({
        model: YTL_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!ytlApiResponse.ok) {
        const errorData = await ytlApiResponse.text();
        console.error("YTL API Error:", errorData);
        throw new Error(`YTL API returned an error: ${ytlApiResponse.status}`);
    }

    const ytlData = await ytlApiResponse.json();
    const answer = ytlData.choices[0].message.content;

    return NextResponse.json({ answer });

  } catch (error: any) {
    console.error("Error in follow-up chat:", error);
    return NextResponse.json({ error: "Failed to get response." }, { status: 500 });
  }
}
