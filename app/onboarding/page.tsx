import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import dayjs from "dayjs";

import { authClient } from "@/app/_lib/auth-client";
import { getHome, getMe } from "@/app/_lib/api/fetch-generated";
import { Chatbot } from "@/components/chatbot";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
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

  if (
    homeData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    meData.status === 200 &&
    meData.data !== null
  ) {
    redirect("/");
  }

  return (
    <Chatbot
      mode="page"
      pageInitialMessage="Quero começar a melhorar minha saúde!"
      topbarAction={
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      }
    />
  );
}
