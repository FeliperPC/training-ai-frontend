import dayjs from "dayjs";
import { Calendar, Check, CircleHelp, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { authClient } from "@/app/_lib/auth-client";
import {
  completeWorkoutSession,
  getWorkoutDay,
  startWorkoutSession,
} from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

import { BackButton } from "./_components/back-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import { StartWorkoutButton } from "./_components/start-workout-button";

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
  dayId: string;
}

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { workoutPlanId, dayId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const response = await getWorkoutDay(workoutPlanId, dayId);

  if (response.status !== 200) {
    redirect("/");
  }

  const workoutDay = response.data;
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60,
  );
  const weekDayLabel = WEEKDAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;
  const sortedExercises = [...workoutDay.exercises].sort(
    (a, b) => a.order - b.order,
  );

  const completedSession = workoutDay.sessions.find(
    (s) => s.startedAt && s.completedAt,
  );
  const inProgressSession = workoutDay.sessions.find(
    (s) => s.startedAt && !s.completedAt,
  );

  let sessionStatus: "not-started" | "in-progress" | "completed";
  if (completedSession) {
    sessionStatus = "completed";
  } else if (inProgressSession) {
    sessionStatus = "in-progress";
  } else {
    sessionStatus = "not-started";
  }

  const inProgressSessionId = inProgressSession?.id;

  const handleStartWorkout = async () => {
    "use server";
    await startWorkoutSession(workoutPlanId, dayId);
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${dayId}`);
  };

  const handleCompleteWorkout = async () => {
    "use server";
    if (!inProgressSessionId) return;
    await completeWorkoutSession(workoutPlanId, dayId, inProgressSessionId, {
      completedAt: dayjs().toISOString(),
    });
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${dayId}`);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-5">
        <BackButton />
        <h1 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          Treino de Hoje
        </h1>
      </div>

      <div className="px-5 pt-4">
        <div className="relative flex w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {workoutDay.coverImageUrl ? (
            <Image
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
              fill
              className="object-cover"
              priority
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

          <div className="relative mt-16 flex w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
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
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            {sessionStatus === "not-started" && (
              <StartWorkoutButton startAction={handleStartWorkout} />
            )}

            {sessionStatus === "completed" && (
              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-background/16 backdrop-blur-[4px]">
                <Check className="size-4 text-background" />
                <span className="font-inter-tight text-sm font-semibold text-background">
                  Concluído!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          Exercícios
        </h2>

        <div className="flex flex-col gap-3">
          {sortedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <span className="font-inter-tight text-sm font-semibold text-primary">
                    {exercise.order + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-inter-tight text-sm font-semibold leading-[1.4] text-foreground">
                    {exercise.name}
                  </span>
                  <span className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
                    {exercise.sets} séries · {exercise.reps} reps ·{" "}
                    {exercise.restTimeInSeconds}s descanso
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
              >
                <CircleHelp className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {sessionStatus === "in-progress" && (
        <div className="px-5 pb-5">
          <CompleteWorkoutButton completeAction={handleCompleteWorkout} />
        </div>
      )}

      <BottomNav activeTab="calendar" />
    </div>
  );
}
