import dayjs from "dayjs";
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { getHome } from "@/app/_lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BottomNavProps {
  activeTab?: "home" | "calendar" | "ai" | "stats" | "profile";
}

export async function BottomNav({ activeTab = "home" }: BottomNavProps) {
  const today = dayjs().format("YYYY-MM-DD");
  const homeData = await getHome(today);

  const todayWorkoutDayUrl =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId ? `/workout-plans/${homeData.data.activeWorkoutPlanId}` : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Button
        variant="ghost"
        size="icon-lg"
        className={cn(
          activeTab === "home" ? "text-foreground" : "text-muted-foreground",
        )}
        asChild
      >
        <Link href="/">
          <House className="size-6" />
        </Link>
      </Button>

      {todayWorkoutDayUrl ? (
        <Button
          variant="ghost"
          size="icon-lg"
          className={cn(
            activeTab === "calendar"
              ? "text-foreground"
              : "text-muted-foreground",
          )}
          asChild
        >
          <Link href={todayWorkoutDayUrl}>
            <Calendar className="size-6" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-muted-foreground"
        >
          <Calendar className="size-6" />
        </Button>
      )}

      <Button
        size="icon-lg"
        className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="size-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon-lg"
        className={cn(
          activeTab === "stats" ? "text-foreground" : "text-muted-foreground",
        )}
        asChild
      >
        <Link href="/stats">
          <ChartNoAxesColumn className="size-6" />
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon-lg"
        className={cn(
          activeTab === "profile" ? "text-foreground" : "text-muted-foreground",
        )}
        asChild
      >
        <Link href="/profile">
          <UserRound className="size-6" />
        </Link>
      </Button>
    </nav>
  );
}
