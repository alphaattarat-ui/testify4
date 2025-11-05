// app/api/get-knowledge-bases/route.ts

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function GET() { // <-- Make sure this line only appears ONCE
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }
    const baseApiUrl = "https://api2.heygen.com";

    const res = await fetch(`${baseApiUrl}/v2/streaming/knowledge_base/list`, {
      method: "GET",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("HeyGen API Error Response:", errorText);
      throw new Error(`Failed to fetch knowledge bases. Status: ${res.status}.`);
    }

    const data = await res.json();

    // The list of knowledge bases is located at data.data.list
    const knowledgeBases = data?.data?.list || [];

    return new Response(JSON.stringify(knowledgeBases), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error retrieving knowledge bases:", error);

    return new Response(JSON.stringify({ error: "Failed to retrieve knowledge bases" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}