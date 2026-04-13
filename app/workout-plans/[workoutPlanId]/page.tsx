import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/bottom-nav";

import { BackButton } from "./days/[dayId]/_components/back-button";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
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
  const workoutDays = workoutPlan.workoutDays.filter((day) => !day.isRest);

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-5">
        <BackButton />
        <h1 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          Plano de Treino
        </h1>
      </div>

      <div className="px-5 pt-4">
        <Badge className="font-inter-tight text-xs font-semibold">
          {workoutPlan.name}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          Treinos da Semana
        </h2>

        <div className="flex flex-col gap-3">
          {workoutDays.map((day) => {
            const durationInMinutes = Math.round(
              day.estimatedDurationInSeconds / 60,
            );
            const weekDayLabel = WEEKDAY_LABELS[day.weekDay] ?? day.weekDay;

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

                  <div className="relative flex flex-col gap-2 items-start">
                    <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
                      {day.name}
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
      </div>

      <BottomNav activeTab="calendar" />
    </div>
  );
}
