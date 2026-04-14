import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abril",
  "Maio",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface MonthWeeks {
  label: string;
  weeks: string[][];
}

const getMonthWeeks = (year: number, month: number): MonthWeeks => {
  const firstDay = dayjs(new Date(year, month, 1));
  const lastDay = firstDay.endOf("month");
  const label = MONTH_NAMES[month];

  const weeks: string[][] = [];
  let currentMonday = firstDay.day() === 1
    ? firstDay
    : firstDay.subtract((firstDay.day() + 6) % 7, "day");

  while (currentMonday.isBefore(lastDay) || currentMonday.isSame(lastDay, "day")) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = currentMonday.add(d, "day");
      if (date.month() === month) {
        week.push(date.format("YYYY-MM-DD"));
      } else {
        week.push("");
      }
    }
    weeks.push(week);
    currentMonday = currentMonday.add(7, "day");
  }

  return { label, weeks };
};

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
}

export const ConsistencyHeatmap = ({
  consistencyByDay,
}: ConsistencyHeatmapProps) => {
  const today = dayjs();
  const months: MonthWeeks[] = [];

  for (let i = 2; i >= 0; i--) {
    const target = today.subtract(i, "month");
    months.push(getMonthWeeks(target.year(), target.month()));
  }

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-border p-5">
      {months.map((month) => (
        <div key={month.label} className="flex flex-col gap-1.5">
          <p className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
            {month.label}
          </p>
          <div className="flex gap-1">
            {month.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  if (!date) {
                    return (
                      <div key={dayIndex} className="size-5 rounded-md" />
                    );
                  }

                  const status = consistencyByDay[date];

                  return (
                    <div
                      key={date}
                      className={cn(
                        "size-5 rounded-md",
                        status?.workoutDayCompleted && "bg-primary",
                        !status?.workoutDayCompleted &&
                          status?.workoutDayStarted &&
                          "bg-primary/20",
                        !status?.workoutDayStarted &&
                          !status?.workoutDayCompleted &&
                          "border border-border",
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
