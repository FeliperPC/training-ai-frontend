import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";

import type { GetHome200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface WorkoutDayCardProps {
  workoutDay: GetHome200TodayWorkoutDay;
}

export function WorkoutDayCard({ workoutDay }: WorkoutDayCardProps) {
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60,
  );
  const weekDayLabel = WEEKDAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;

  return (
    <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5 md:h-[240px] md:p-6 lg:h-[280px] lg:p-7">
      {workoutDay.coverImageUrl ? (
        <Image
          src={workoutDay.coverImageUrl}
          alt={workoutDay.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-foreground" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

      <div className="relative flex items-center justify-center">
        <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-[5px] backdrop-blur-[4px]">
          <Calendar className="size-3.5 text-background" />
          <span className="font-inter-tight text-xs font-semibold uppercase leading-none text-background">
            {weekDayLabel}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-2 items-start">
        <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background md:text-3xl lg:text-4xl">
          {workoutDay.name}
        </h3>
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1">
            <Timer className="size-3.5 text-background/70" />
            <span className="font-inter-tight text-xs leading-[1.4] text-background/70">
              {durationInMinutes}min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="size-3.5 text-background/70" />
            <span className="font-inter-tight text-xs leading-[1.4] text-background/70">
              {workoutDay.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
