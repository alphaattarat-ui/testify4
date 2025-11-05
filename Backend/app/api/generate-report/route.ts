// app/api/generate-report/route.ts
import { NextRequest, NextResponse } from "next/server";

// --- Use the new environment variables ---
const YTL_API_KEY = process.env.YTL_API_KEY;
const YTL_API_URL = process.env.YTL_API_URL;
const YTL_MODEL = process.env.YTL_MODEL;

const REPORT_GENERATION_PROMPT = `
You are an expert AI analyst. Your task is to analyze the following conversation transcript between a user and an interactive avatar.
Based on the conversation, generate a detailed training session report in the following format:

---
Training Session Report

Summary: [Provide a concise summary of the session's purpose and outcome.]

Performance Metrics:
- Accuracy: [Provide a percentage and a brief explanation.]
- Attention to Detail: [Provide a percentage and a brief explanation.]
- Comprehension: [Provide a percentage and a brief explanation.]

Strengths:
- [List 2-3 key strengths demonstrated in the conversation.]

Weaknesses:
- [List 2-3 key areas for improvement observed in the conversation.]

Recommendations:
- [Provide 2-3 actionable recommendations for future improvement.]
---

Here is the session data you need to analyze:

Knowledge Base Name: {{KNOWLEDGE_BASE_NAME}}
Session Start Time: {{SESSION_START_TIME}}
Session End Time: {{SESSION_END_TIME}}
Total Duration: {{DURATION}}
User Name: {{USER_NAME}}

Conversation Transcript:
{{CHAT_HISTORY}}
`;

export async function POST(req: NextRequest) {
  try {
    // --- Check for the new variables ---
    if (!YTL_API_KEY || !YTL_API_URL || !YTL_MODEL) {
      return NextResponse.json(
        { error: "YTL API configuration is missing on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { chatHistory, knowledgeBaseName, sessionStartTime, sessionEndTime, duration, userName } = body;

    const formattedPrompt = REPORT_GENERATION_PROMPT
      .replace("{{KNOWLEDGE_BASE_NAME}}", knowledgeBaseName)
      .replace("{{SESSION_START_TIME}}", new Date(sessionStartTime).toLocaleString())
      .replace("{{SESSION_END_TIME}}", new Date(sessionEndTime).toLocaleString())
      .replace("{{DURATION}}", duration)
      .replace("{{USER_NAME}}", userName)
      .replace("{{CHAT_HISTORY}}", chatHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n'));

    // --- Use the dynamic URL and model from .env ---
    const ytlApiResponse = await fetch(YTL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YTL_API_KEY}`,
      },
      body: JSON.stringify({
        model: YTL_MODEL,
        messages: [{ role: "user", content: formattedPrompt }],
        temperature: 0.7,
      }),
    });

    if (!ytlApiResponse.ok) {
        const errorData = await ytlApiResponse.text();
        console.error("YTL API Error:", errorData);
        throw new Error(`YTL API returned an error: ${ytlApiResponse.status}`);
    }

    const ytlData = await ytlApiResponse.json();
    // NOTE: This response structure might need to be adjusted based on YTL's actual output.
    const reportContent = ytlData.choices[0].message.content;

    return NextResponse.json({ report: reportContent });

  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report.", details: error.message },
      { status: 500 }
    );
  }
}