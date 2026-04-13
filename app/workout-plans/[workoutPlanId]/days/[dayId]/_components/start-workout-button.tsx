"use client";

import { Play } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

interface StartWorkoutButtonProps {
  startAction: () => Promise<void>;
}

export function StartWorkoutButton({ startAction }: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(async () => {
      await startAction();
    });
  };

  return (
    <Button
      className="h-11 w-full gap-2 rounded-lg font-inter-tight text-sm font-semibold"
      onClick={handleStart}
      disabled={isPending}
    >
      <Play className="size-4" />
      {isPending ? "Iniciando..." : "Iniciar treino"}
    </Button>
  );
}
