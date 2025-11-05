// app/api/get-report/route.ts (Final Correct Version)
import { NextResponse, NextRequest } from "next/server"; // <-- Ensure NextRequest is imported
import { getReport } from "../../lib/reportStore";

export async function GET(req: NextRequest) { // <-- Use NextRequest type
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
  }

  // NOTE: getReport is synchronous, so NO 'await' is needed.
  const reportData = getReport(id); 

  if (!reportData) {
    // This is the line that caused the 404 in the console.
    return NextResponse.json({ error: "Report not found or has expired." }, { status: 404 });
  }

  return NextResponse.json(reportData);
}