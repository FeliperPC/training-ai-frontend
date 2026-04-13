"use client";

import { Check } from "lucide-react";
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
      className="h-14 w-full gap-2 font-inter-tight text-base font-semibold"
      onClick={handleComplete}
      disabled={isPending}
    >
      <Check className="size-5" />
      {isPending ? "Concluindo..." : "Marcar como concluído"}
    </Button>
  );
}
