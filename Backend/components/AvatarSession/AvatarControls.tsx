// components/AvatarSession/AvatarControls.tsx
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useVoiceChat } from "../logic/useVoiceChat";
import { useInterrupt } from "../logic/useInterrupt";
import { useStreamingAvatarContext } from "../logic/context";
import { Button } from "../Button";
import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";

interface AvatarControlsProps {
  onStop: () => void;
  onClearMessages: () => void;
  knowledgeBaseName: string;
}

export const AvatarControls: React.FC<AvatarControlsProps> = ({ onStop, onClearMessages, knowledgeBaseName }) => {
  const router = useRouter();
  const { isVoiceChatLoading, isVoiceChatActive, startVoiceChat, stopVoiceChat } = useVoiceChat();
  const { interrupt } = useStreamingAvatarContext();
  const { messages } = useStreamingAvatarContext();

  const [isStopping, setIsStopping] = useState(false);

  const handleStopSession = async () => {
    const isConfirmed = window.confirm("Are you sure you want to stop the session and generate a performance report?");
    if (!isConfirmed) return;

    setIsStopping(true);
    try {
      // Gather session data
      const sessionData = {
        knowledgeBaseName,
        sessionStartTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Placeholder
        sessionEndTime: new Date().toISOString(),
        duration: "10 minutes", // Placeholder
        userName: "User", // Placeholder
        chatHistory: messages,
      };

      // Call the API to generate the report
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report.");
      }

      const { report } = await response.json();

      // --- UPDATED: Encode data into URL search params ---
      const reportData = {
        report,
        sessionData,
      };
      const queryString = encodeURIComponent(JSON.stringify(reportData));
      
      router.push(`/report?data=${queryString}`);

    } catch (error) {
      console.error("Error stopping session:", error);
      alert("Could not generate the report. Please try again.");
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 relative w-full items-center">
      <ToggleGroup
        className={`bg-zinc-700 rounded-lg p-1 ${isVoiceChatLoading ? "opacity-50" : ""}`}
        disabled={isVoiceChatLoading}
        type="single"
        value={isVoiceChatActive || isVoiceChatLoading ? "voice" : "text"}
        onValueChange={(value) => {
          if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
            startVoiceChat();
          } else if (value === "text" && isVoiceChatActive && !isVoiceChatLoading) {
            stopVoiceChat();
          }
        }}
      >
        <ToggleGroupItem className="data-[state=on]:bg-zinc-800 rounded-lg p-2 text-sm w-[90px] text-center" value="voice">Voice Chat</ToggleGroupItem>
        <ToggleGroupItem className="data-[state=on]:bg-zinc-800 rounded-lg p-2 text-sm w-[90px] text-center" value="text">Text Chat</ToggleGroupItem>
      </ToggleGroup>
      {isVoiceChatActive || isVoiceChatLoading ? <AudioInput /> : <TextInput />}
      <div className="absolute top-[-70px] right-3 flex gap-2">
        <Button className="!bg-zinc-700 !text-white" onClick={interrupt}>Interrupt</Button>
        <Button
          className="!bg-red-600 hover:!bg-red-700 !text-white font-bold"
          onClick={handleStopSession}
          disabled={isStopping}
        >
          {isStopping ? "Stopping & Generating..." : "Stop Session"}
        </Button>
      </div>
    </div>
  );
};