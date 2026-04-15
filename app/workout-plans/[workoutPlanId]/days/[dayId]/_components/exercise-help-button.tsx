"use client";

import { CircleHelp } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

interface ExerciseHelpButtonProps {
  exerciseName: string;
}

export const ExerciseHelpButton = ({
  exerciseName,
}: ExerciseHelpButtonProps) => {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false)
  );
  const [, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault("")
  );

  const handleClick = async () => {
    await setInitialMessage(
      `Como executar o exercício ${exerciseName} corretamente?`
    );
    await setChatOpen(true);
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground"
      onClick={handleClick}
    >
      <CircleHelp className="size-5" />
    </Button>
  );
};
