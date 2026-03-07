"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return null;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-muted-foreground">Home page — coming soon</p>
    </div>
  );
}
