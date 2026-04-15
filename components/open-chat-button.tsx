"use client";

import { Sparkles } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

export const OpenChatButton = () => {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Button
      size="icon-lg"
      className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={() => setChatOpen(true)}
    >
      <Sparkles className="size-6" />
    </Button>
  );
};
