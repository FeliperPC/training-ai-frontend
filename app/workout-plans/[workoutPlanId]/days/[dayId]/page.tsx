import dayjs from "dayjs";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { authClient } from "@/app/_lib/auth-client";
import {
  completeWorkoutSession,
  getHome,
  getMe,
  getWorkoutDay,
  startWorkoutSession,
} from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

import { BackButton } from "./_components/back-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import { ExerciseCard } from "./_components/exercise-card";
import { StartWorkoutButton } from "./_components/start-workout-button";

const WEEKDAY_LABELS_UPPER: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

const WEEKDAY_LABELS_TITLE: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
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

  const today = dayjs().format("YYYY-MM-DD");
  const [response, homeData, meData] = await Promise.all([
    getWorkoutDay(workoutPlanId, dayId),
    getHome(today),
    getMe(),
  ]);

  if (response.status !== 200) {
    redirect("/");
  }

  if (homeData.status !== 200 || meData.status !== 200) {
    redirect("/auth");
  }

  if (!homeData.data.activeWorkoutPlanId || meData.data === null) {
    redirect("/onboarding");
  }

  const workoutDay = response.data;
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60,
  );
  const weekDayLabelUpper =
    WEEKDAY_LABELS_UPPER[workoutDay.weekDay] ?? workoutDay.weekDay;
  const weekDayLabelTitle =
    WEEKDAY_LABELS_TITLE[workoutDay.weekDay] ?? workoutDay.weekDay;
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
    <div className="flex min-h-dvh flex-col bg-background pb-24 md:pb-32">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 pt-5 md:px-8 lg:max-w-5xl">
        <BackButton />
        <h1 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          {weekDayLabelTitle}
        </h1>
        <div className="size-9" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-5 md:px-8 lg:max-w-5xl">
        <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5 md:h-[260px] md:p-7 lg:h-[300px]">
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
                {weekDayLabelUpper}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-end justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
                {workoutDay.name}
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
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            {sessionStatus === "not-started" && (
              <StartWorkoutButton startAction={handleStartWorkout} />
            )}
            {sessionStatus === "completed" && (
              <Button
                variant="ghost"
                className="shrink-0 rounded-full border border-background/50 px-4 py-2 font-inter-tight text-sm font-semibold text-background hover:bg-background/10 hover:text-background"
              >
                Concluído!
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sortedExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {sessionStatus === "in-progress" && (
          <div className="md:mx-auto md:w-full md:max-w-md">
            <CompleteWorkoutButton completeAction={handleCompleteWorkout} />
          </div>
        )}
      </div>

      <BottomNav activeTab="calendar" />
    </div>
  );
}
