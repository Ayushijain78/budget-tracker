"use client";

import { useState } from "react";

type Props = {
  transactions: any[];
};

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIChatWidget({ transactions }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi 👋 I’m your AI Budget Assistant.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch("/api/financial-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          transactions,
        }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white w-14 h-14 rounded-full shadow-2xl hover:scale-105 transition-all"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[550px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border dark:border-gray-700 z-50 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">AI Budget Assistant</h2>
              <p className="text-xs text-gray-300">
                Ask about your finances
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-white dark:bg-gray-700 dark:text-white shadow"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bg-white dark:bg-gray-700 dark:text-white p-3 rounded-2xl w-fit text-sm animate-pulse shadow">
                Thinking...
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t dark:border-gray-700 bg-white dark:bg-gray-900">
            {[
              "Where am I overspending?",
              "How can I save money?",
              "Top spending category?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setMessage(q)}
                className="whitespace-nowrap text-xs bg-gray-100 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-full"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-5 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}