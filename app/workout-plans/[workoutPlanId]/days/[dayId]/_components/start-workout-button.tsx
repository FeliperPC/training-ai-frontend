"use client";

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
      className="shrink-0 rounded-full px-4 py-2 font-inter-tight text-sm font-semibold"
      onClick={handleStart}
      disabled={isPending}
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
