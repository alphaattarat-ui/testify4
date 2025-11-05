"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { YTLMessageHistory, YTLMessage, YTLMessageSender } from "@/components/YTLMessageHistory";

interface SessionData {
  knowledgeBaseName: string;
  sessionStartTime: string;
  sessionEndTime: string;
  duration: string;
  userName: string;
}

interface ReportState {
  report: string;
  sessionData: SessionData;
}

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [report, setReport] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [ytlChatMessages, setYtlChatMessages] = useState<YTLMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) return;

    try {
      let parsed: ReportState;

      try {
        // Try decoding first (for encoded URLs)
        parsed = JSON.parse(decodeURIComponent(dataParam));
      } catch {
        // Fallback if not encoded
        parsed = JSON.parse(dataParam);
      }

      setReport(parsed.report);
      setSessionData(parsed.sessionData);

      // Initialize chat with a system message
      setYtlChatMessages([
        {
          id: Date.now().toString(),
          sender: YTLMessageSender.COACH,
          content: "Welcome! I am YTL ILMU. Ask me anything about your report.",
        },
      ]);
    } catch (error) {
      console.error("Failed to parse report data:", error);
    }
  }, [searchParams]);

  const handleSendFollowUp = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: YTLMessage = {
      id: Date.now().toString(),
      sender: YTLMessageSender.USER,
      content: inputValue,
    };
    setYtlChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue("");

    try {
      const response = await fetch("/api/chat-with-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputValue, report }),
      });

      if (!response.ok) throw new Error("Failed to get advice.");

      const { answer } = await response.json();

      const coachMessage: YTLMessage = {
        id: (Date.now() + 1).toString(),
        sender: YTLMessageSender.COACH,
        content: answer,
      };
      setYtlChatMessages((prev) => [...prev, coachMessage]);
    } catch (error) {
      console.error(error);
      alert("Could not get a response from YTL ILMU.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = 15;
    const textWidth = pageWidth - margins * 2;
    const lines = doc.splitTextToSize(report, textWidth);
    let y = 20;

    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margins, y);
      y += 7;
    });

    const fileName = `training-session-report-${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  const handleStartNewSession = () => {
    router.push("/", undefined, { shallow: false });
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading Report...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 h-screen bg-black text-white">
      {/* Report Section */}
      <div className="flex-1 lg:flex-[2] bg-zinc-900 rounded-lg p-6 overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Performance Report</h1>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF}>Download PDF</Button>
            <Button onClick={handleStartNewSession}>Start New Session</Button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-zinc-300 flex-grow">
          {report}
        </pre>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-zinc-900 rounded-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          Ask the YTL AI Coach for Advice
        </h2>

        <div className="flex-1 overflow-y-auto mb-4">
          <YTLMessageHistory messages={ytlChatMessages} />
        </div>

        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Ask for more advice..."
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendFollowUp()}
          />
          <Button onClick={handleSendFollowUp} disabled={isLoading}>
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
