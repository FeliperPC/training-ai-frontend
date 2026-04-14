"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

interface CompleteWorkoutButtonProps {
  completeAction: () => Promise<void>;
}

export function CompleteWorkoutButton({
  completeAction,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      await completeAction();
    });
  };

  return (
    <Button
      variant="outline"
      className="h-12 w-full rounded-full font-inter-tight text-sm font-semibold"
      onClick={handleComplete}
      disabled={isPending}
    >
      {isPending ? "Concluindo..." : "Marcar como concluído"}
    </Button>
  );
}
