"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

const chatTransport = new DefaultChatTransport({
  api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
  credentials: "include",
});

export const Chatbot = () => {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false)
  );
  const [initialMessage, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault("")
  );

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const isStreaming = status === "streaming";

  useEffect(() => {
    if (chatOpen && initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: initialMessage }],
      });
      setInitialMessage(null);
    }
  }, [chatOpen, initialMessage, sendMessage, setInitialMessage]);

  useEffect(() => {
    if (!chatOpen) {
      initialMessageSentRef.current = false;
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: trimmed }],
    });
    setInput("");
  };

  const handleSuggestedMessage = (message: string) => {
    if (isStreaming) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: message }],
    });
  };

  const handleClose = () => {
    setChatOpen(false);
    setInitialMessage(null);
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center px-4 pb-4 pt-40">
      <div
        className="absolute inset-0 bg-foreground/30"
        onClick={handleClose}
      />

      <div className="relative flex min-h-0 w-full max-w-[393px] flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
        <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/8 border border-primary/8 p-3">
              <Sparkles className="size-[18px] text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-inter-tight text-base font-semibold leading-[1.05] text-foreground">
                Coach AI
              </span>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="font-inter-tight text-xs leading-[1.15] text-primary">
                  Online
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="size-6" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col gap-5 p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col",
                  message.role === "user" ? "items-end pl-[60px]" : "items-start pr-[60px]"
                )}
              >
                {message.role === "user" ? (
                  <div className="rounded-xl bg-primary p-3">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map((part, index) => (
                        <span
                          key={index}
                          className="font-inter-tight text-sm leading-[1.4] text-primary-foreground"
                        >
                          {part.text}
                        </span>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-secondary p-3">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map((part, index) => (
                        <div
                          key={index}
                          className="font-inter-tight text-sm leading-[1.4] text-foreground [&_p]:m-0"
                        >
                          <Streamdown
                            isAnimating={
                              isStreaming &&
                              message.id === messages[messages.length - 1]?.id
                            }
                          >
                            {part.text}
                          </Streamdown>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2.5 px-5 pb-3">
              {SUGGESTED_MESSAGES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestedMessage(suggestion)}
                  className="rounded-full bg-primary/10 px-4 py-2 font-inter-tight text-sm leading-none text-foreground transition-colors hover:bg-primary/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border p-5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Digite sua mensagem"
              className="flex-1 rounded-full border border-border bg-secondary px-4 py-3 font-inter-tight text-sm text-foreground placeholder:text-muted-foreground outline-none"
              disabled={isStreaming}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
