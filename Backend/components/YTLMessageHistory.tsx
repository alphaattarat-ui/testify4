import React, { useEffect, useRef } from "react";

export enum YTLMessageSender {
  USER = "USER",
  COACH = "COACH",
}

export interface YTLMessage {
  id: string;
  sender: YTLMessageSender;
  content: string;
}

interface YTLMessageHistoryProps {
  messages: YTLMessage[];
}

export const YTLMessageHistory: React.FC<YTLMessageHistoryProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-y-auto flex flex-col gap-2 px-2 py-2 text-white max-h-[250px]"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col gap-1 max-w-[400px] ${
            message.sender === YTLMessageSender.USER
              ? "self-end items-end bg-blue-600 rounded-lg p-2"
              : "self-start items-start bg-zinc-700 rounded-lg p-2"
          }`}
        >
          <p className="text-xs text-zinc-400">
            {message.sender === YTLMessageSender.COACH ? "YTL ILMU" : "You"}
          </p>
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
};
