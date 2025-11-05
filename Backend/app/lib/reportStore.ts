// app/lib/reportStore.ts

// This is a simple, non-persistent, in-memory store for demonstration purposes
// in a serverless environment. For production, this should be replaced
// with a database like Firestore, DynamoDB, or Redis.

interface SessionData {
  chatHistory: Array<{ sender: string; content: string }>;
  knowledgeBaseName: string;
  sessionStartTime: string;
  sessionEndTime: string;
  duration: number;
  userName: string;
}

interface ReportData {
  report: string;
  sessionData: SessionData;
}

// Global Map to store reports (volatile in a serverless context)
const reportStore = new Map<string, ReportData>();

/**
 * Saves a generated report and its associated session data.
 * @param id A unique ID for the report.
 * @param data The report content and session data.
 */
export function saveReport(id: string, data: ReportData): void {
  // In a real application, you would save this to a database (e.g., Firestore).
  reportStore.set(id, data);
  console.log(`[ReportStore] Saved report ID: ${id}`);
}

/**
 * Retrieves a report by its unique ID.
 * @param id The unique ID of the report.
 * @returns The report data or undefined if not found.
 */
export function getReport(id: string): ReportData | undefined {
  const data = reportStore.get(id);
  console.log(`[ReportStore] Retrieved report ID: ${id} (Found: ${!!data})`);
  return data;
}

/**
 * Utility to clear expired reports (not fully implemented here, but good practice).
 */
export function clearExpiredReports(): void {
  // Logic to clean up old entries if this were a production database.
  console.log(`[ReportStore] Report store currently holds ${reportStore.size} reports.`);
}
