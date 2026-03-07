"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { authClient } from "@/app/_lib/auth-client";

export default function AuthPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return null;
  }

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex h-dvh w-full flex-col items-center overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 pt-12">
        <Image
          src="/fit-ai-logo.svg"
          alt="FIT.AI"
          width={85}
          height={38}
          priority
        />
      </div>

      <div className="relative z-10 mt-auto flex w-full max-w-[402px] flex-col items-center gap-[60px] rounded-t-[20px] bg-primary px-5 pb-10 pt-12">
        <div className="flex w-full flex-col items-center gap-6">
          <h1 className="w-full text-center font-inter-tight text-[32px] font-semibold leading-[1.05] text-primary-foreground">
            O app que vai transformar a forma como você treina.
          </h1>

          <Button
            variant="ghost"
            className="h-[38px] gap-2 rounded-full bg-background px-6 text-sm font-semibold text-foreground hover:bg-background/90 hover:text-foreground"
            onClick={handleGoogleLogin}
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={16}
              height={16}
            />
            Fazer login com Google
          </Button>
        </div>

        <p className="text-xs leading-[1.4] text-primary-foreground/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
