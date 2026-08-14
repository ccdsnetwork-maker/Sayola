"use client";

import { useEffect, useRef, useState } from "react";
import { findJuliaAnswer } from "@/src/lib/juliaMatcher";
import {
  MessageCircle,
  Send,
  X,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "julia";
  text: string;
  fallback?: boolean;
};

export default function JuliaChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "julia",
      text: "Hello! I'm Julia, SAYOLA's virtual assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function typeJuliaResponse(
    response: string,
    fallback: boolean,
  ) {
    const messageId = Date.now() + 1;

    setMessages((current) => [
      ...current,
      {
        id: messageId,
        sender: "julia",
        text: "",
        fallback,
      },
    ]);

    setIsTyping(true);

    let index = 0;

    const typingSpeed = 18;

    const interval = setInterval(() => {
      index++;

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                text: response.slice(0, index),
              }
            : message,
        ),
      );

      if (index >= response.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, typingSpeed);
  }

  function sendMessage() {
    const text = input.trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    const result = findJuliaAnswer(text);

    const response =
      result?.answer ??
      "I'm sorry, I don't have enough information to answer that question yet. Please contact SAYOLA directly and the team will be happy to assist you.";

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");

    typeJuliaResponse(
      response,
      !result,
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-[390px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0A2342] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-white">
                <img
                  src="/images/Julia.png"
                  alt="Julia"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="font-semibold">Julia</p>
                <p className="text-xs text-white/75">
                  SAYOLA Virtual Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label="Close Julia chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[390px] overflow-y-auto bg-slate-50 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "rounded-br-md bg-[#FF6B00] text-white"
                        : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.sender === "julia" && (
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
                          <img
                            src="/images/Julia.png"
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <span className="text-xs font-semibold text-[#0A2342]">
                          Julia
                        </span>
                      </div>
                    )}

                    {message.text ? (
                      <p>{message.text}</p>
                    ) : (
                      <div className="flex items-center gap-1 py-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      </div>
                    )}

                    {message.fallback && message.text && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <a
                          href="tel:"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A2342] px-3 py-2 text-xs font-medium text-white"
                        >
                          <Phone size={14} />
                          Call SAYOLA
                        </a>

                        <a
                          href="mailto:"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B00] px-3 py-2 text-xs font-medium text-white"
                        >
                          <Mail size={14} />
                          Email SAYOLA
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-[#FF6B00]">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isTyping
                    ? "Julia is typing..."
                    : "Ask Julia about SAYOLA..."
                }
                disabled={isTyping}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="rounded-lg bg-[#FF6B00] p-2.5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Julia button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl transition hover:scale-105"
          aria-label="Open Julia chat"
        >
          <img
            src="/images/Julia.png"
            alt="Open Julia chat"
            className="h-full w-full object-contain"
          />
        </button>
      )}

      {/* Minimize button */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A2342] text-white shadow-xl"
          aria-label="Minimize Julia chat"
        >
          <ChevronDown size={22} />
        </button>
      )}
    </>
  );
}
