import { Calendar, Dumbbell, Goal, Timer, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/components/bottom-nav";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

const WEEKDAY_ORDER: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

interface PageParams {
  workoutPlanId: string;
}

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { workoutPlanId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const response = await getWorkoutPlan(workoutPlanId);

  if (response.status !== 200) {
    redirect("/");
  }

  const workoutPlan = response.data;
  const sortedDays = [...workoutPlan.workoutDays].sort(
    (a, b) =>
      (WEEKDAY_ORDER[a.weekDay] ?? 0) - (WEEKDAY_ORDER[b.weekDay] ?? 0),
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0">
          <Image
            src="/home-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div
          className="absolute inset-0 rounded-b-[20px]"
          style={{
            backgroundImage:
              "linear-gradient(238deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <Image
          src="/fit-ai-logo.svg"
          alt="FIT.AI"
          width={85}
          height={38}
          className="relative"
          priority
        />

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-[5px]">
              <Goal className="size-4 text-background" />
              <span className="font-inter-tight text-xs font-semibold uppercase leading-none text-background">
                {workoutPlan.name}
              </span>
            </div>
            <h1 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
              Plano de Treino
            </h1>
          </div>
          <div className="size-12 shrink-0" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {sortedDays.map((day) => {
          const weekDayLabel = WEEKDAY_LABELS[day.weekDay] ?? day.weekDay;

          if (day.isRest) {
            return (
              <div
                key={day.id}
                className="flex h-[110px] w-full flex-col items-start justify-between overflow-hidden rounded-xl bg-muted p-5"
              >
                <div className="flex items-center gap-1 rounded-full bg-black/8 px-2.5 py-[5px]">
                  <Calendar className="size-3.5 text-foreground" />
                  <span className="font-inter-tight text-xs font-semibold uppercase leading-none text-foreground">
                    {weekDayLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-foreground" />
                  <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-foreground">
                    Descanso
                  </h3>
                </div>
              </div>
            );
          }

          const durationInMinutes = Math.round(
            day.estimatedDurationInSeconds / 60,
          );

          return (
            <Link
              key={day.id}
              href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
            >
              <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
                {day.coverImageUrl ? (
                  <Image
                    src={day.coverImageUrl}
                    alt={day.name}
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

                <div className="relative flex flex-col items-start gap-2">
                  <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
                    {day.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Timer className="size-3.5 text-background/70" />
                      <span className="font-inter-tight text-xs leading-[1.4] text-background/70">
                        {durationInMinutes}min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="size-3.5 text-background/70" />
                      <span className="font-inter-tight text-xs leading-[1.4] text-background/70">
                        {day.exercisesCount} exercícios
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav activeTab="calendar" />
    </div>
  );
}
