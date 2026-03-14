import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

import { authClient } from "@/app/_lib/auth-client";
import { getHome } from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { WeeklyConsistency } from "@/components/weekly-consistency";
import { WorkoutDayCard } from "@/components/workout-day-card";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const today = dayjs().format("YYYY-MM-DD");
  const homeData = await getHome(today);

  if (homeData.status !== 200) {
    redirect("/auth");
  }

  const { todayWorkoutDay, consistencyByDay, workoutStreak } = homeData.data;
  const firstName = session.data.user.name?.split(" ")[0] ?? "";

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
              "linear-gradient(242deg, transparent 34%, rgb(0 0 0) 100%)",
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
          <div className="flex flex-col gap-1.5">
            <h1 className="font-inter-tight text-2xl font-semibold leading-[1.05] text-background">
              Olá, {firstName}
            </h1>
            <p className="font-inter-tight text-sm leading-[1.15] text-background/70">
              Bora treinar hoje?
            </p>
          </div>
          <div className="rounded-full bg-primary px-4 py-2">
            <span className="font-inter-tight text-sm font-semibold leading-none text-background">
              Bora!
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
            Consistência
          </h2>
          <Button
            variant="ghost"
            size="xs"
            className="font-inter-tight text-xs leading-[1.4] text-primary hover:text-primary/80 hover:bg-transparent"
          >
            Ver histórico
          </Button>
        </div>

        <WeeklyConsistency
          consistencyByDay={consistencyByDay}
          workoutStreak={workoutStreak}
          today={today}
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
            Treino de Hoje
          </h2>
          <Button
            variant="ghost"
            size="xs"
            className="font-inter-tight text-xs leading-[1.4] text-primary hover:text-primary/80 hover:bg-transparent"
          >
            Ver treinos
          </Button>
        </div>

        {todayWorkoutDay ? (
          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
          >
            <WorkoutDayCard workoutDay={todayWorkoutDay} />
          </Link>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-border">
            <p className="font-inter-tight text-sm text-muted-foreground">
              Dia de descanso
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
