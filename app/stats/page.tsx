import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { CircleCheck, CirclePercent, Flame, Hourglass } from "lucide-react";

import { authClient } from "@/app/_lib/auth-client";
import { getHome, getMe, getStats } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/components/bottom-nav";
import { ConsistencyHeatmap } from "@/app/stats/_components/consistency-heatmap";

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const [statsData, homeData, meData] = await Promise.all([
    getStats({ from, to }),
    getHome(today.format("YYYY-MM-DD")),
    getMe(),
  ]);

  if (statsData.status !== 200) {
    redirect("/auth");
  }

  if (homeData.status !== 200 || meData.status !== 200) {
    redirect("/auth");
  }

  if (!homeData.data.activeWorkoutPlanId || meData.data === null) {
    redirect("/onboarding");
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsData.data;

  const totalHours = Math.floor(totalTimeInSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
  const formattedTime = `${totalHours}h${totalMinutes.toString().padStart(2, "0")}m`;

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </div>

      <div className="px-5">
        <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              workoutStreak > 0
                ? "/streak-banner-active.png"
                : "/streak-banner-zero.png"
            }
            alt=""
            className="pointer-events-none absolute inset-0 size-full rounded-xl object-cover"
          />
          <div className="relative flex flex-col items-center gap-3">
            <div className="rounded-full border border-background/12 bg-background/12 p-3 backdrop-blur-[4px]">
              <Flame className="size-8 text-background" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-inter-tight text-5xl font-semibold leading-[0.95] text-background">
                {workoutStreak} {workoutStreak === 1 ? "dia" : "dias"}
              </p>
              <p className="font-inter-tight text-base leading-[1.15] text-background/60">
                Sequência Atual
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-inter-tight text-lg font-semibold leading-[1.4] text-foreground">
          Consistência
        </h2>

        <ConsistencyHeatmap consistencyByDay={consistencyByDay} />

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <CircleCheck className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {completedWorkoutsCount}
              </p>
              <p className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
                Treinos Feitos
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <CirclePercent className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {Math.round(conclusionRate * 100)}%
              </p>
              <p className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
                Taxa de conclusão
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
          <div className="rounded-full bg-primary/8 p-[9px]">
            <Hourglass className="size-4 text-primary" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
              {formattedTime}
            </p>
            <p className="font-inter-tight text-xs leading-[1.4] text-muted-foreground">
              Tempo Total
            </p>
          </div>
        </div>
      </div>

      <BottomNav activeTab="stats" />
    </div>
  );
}
