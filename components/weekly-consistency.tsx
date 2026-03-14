import { Flame } from "lucide-react";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import type { GetHome200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_ABBREVIATIONS = ["S", "T", "Q", "Q", "S", "S", "D"];

interface WeeklyConsistencyProps {
  consistencyByDay: GetHome200ConsistencyByDay;
  workoutStreak: number;
  today: string;
}

export function WeeklyConsistency({
  consistencyByDay,
  workoutStreak,
  today,
}: WeeklyConsistencyProps) {
  const sortedDates = Object.keys(consistencyByDay).sort();
  const mondayToSunday = [...sortedDates.slice(1), sortedDates[0]];

  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
        {mondayToSunday.map((date, index) => {
          const status = consistencyByDay[date];
          const isToday = date === today;

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "size-5 rounded-md",
                  status?.workoutDayCompleted && "bg-primary",
                  !status?.workoutDayCompleted &&
                    status?.workoutDayStarted &&
                    "bg-primary/20",
                  !status?.workoutDayStarted &&
                    !status?.workoutDayCompleted &&
                    isToday &&
                    "border-[1.6px] border-primary",
                  !status?.workoutDayStarted &&
                    !status?.workoutDayCompleted &&
                    !isToday &&
                    "border border-border",
                )}
              />
              <span className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
                {WEEKDAY_ABBREVIATIONS[index]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak/8 px-5 py-2">
        <Flame className="size-5 text-streak" />
        <span className="font-inter-tight text-base font-semibold text-foreground">
          {workoutStreak}
        </span>
      </div>
    </div>
  );
}
