import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import { BicepsFlexed, Ruler, User, Weight } from "lucide-react";
import dayjs from "dayjs";

import { authClient } from "@/app/_lib/auth-client";
import { getHome, getMe } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/components/bottom-nav";
import { LogoutButton } from "@/app/profile/_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const today = dayjs().format("YYYY-MM-DD");
  const [homeData, meData] = await Promise.all([getHome(today), getMe()]);

  if (homeData.status !== 200 || meData.status !== 200) {
    redirect("/auth");
  }

  if (!homeData.data.activeWorkoutPlanId || meData.data === null) {
    redirect("/onboarding");
  }

  const user = session.data.user;
  const me = meData.data;

  const weightKg = me?.weightInGrams ? (me.weightInGrams / 1000).toFixed(1) : "-";
  const heightCm = me?.heightInCentimeters ?? "-";
  const bodyFat = me?.bodyFatPercentage ? `${me.bodyFatPercentage}%` : "-";
  const age = me?.age ?? "-";

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ""}
                width={52}
                height={52}
                className="size-[52px] rounded-full object-cover"
              />
            ) : (
              <div className="flex size-[52px] items-center justify-center rounded-full bg-primary/8">
                <User className="size-6 text-primary" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <p className="font-inter-tight text-lg font-semibold leading-[1.05] text-foreground">
                {user.name}
              </p>
              <p className="font-inter-tight text-sm leading-[1.15] text-foreground/70">
                Plano Básico
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <Weight className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {weightKg}
              </p>
              <p className="font-inter-tight text-xs uppercase leading-[1.4] text-muted-foreground">
                Kg
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <Ruler className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {heightCm}
              </p>
              <p className="font-inter-tight text-xs uppercase leading-[1.4] text-muted-foreground">
                Cm
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <BicepsFlexed className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {bodyFat}
              </p>
              <p className="font-inter-tight text-xs uppercase leading-[1.4] text-muted-foreground">
                Gc
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="rounded-full bg-primary/8 p-[9px]">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-inter-tight text-2xl font-semibold leading-[1.15] text-foreground">
                {age}
              </p>
              <p className="font-inter-tight text-xs uppercase leading-[1.4] text-muted-foreground">
                Anos
              </p>
            </div>
          </div>
        </div>

        <LogoutButton />
      </div>

      <BottomNav activeTab="profile" />
    </div>
  );
}
