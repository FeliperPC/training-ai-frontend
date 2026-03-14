import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { getHome } from "./_lib/api/fetch-generated";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    }
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const homeData = await getHome(dayjs().format("YYYY-MM-DD"));

  console.log(homeData);

  return (
    <div className="flex min-h-dvh items-center justify-center">
     <p>Home</p>
    </div>
  );
}
