import { CircleHelp, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <span className="font-inter-tight text-base font-semibold leading-[1.4] text-foreground">
          {exercise.name}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
        >
          <CircleHelp className="size-5" />
        </Button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-muted px-2.5 py-[5px] font-inter-tight text-xs font-semibold uppercase leading-none text-muted-foreground">
          {exercise.sets} séries
        </span>
        <span className="rounded-full bg-muted px-2.5 py-[5px] font-inter-tight text-xs font-semibold uppercase leading-none text-muted-foreground">
          {exercise.reps} reps
        </span>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-[5px] font-inter-tight text-xs font-semibold uppercase leading-none text-muted-foreground">
          <Zap className="size-3.5" />
          {exercise.restTimeInSeconds}s
        </span>
      </div>
    </div>
  );
};
