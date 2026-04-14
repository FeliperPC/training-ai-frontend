"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/app/_lib/auth-client";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 rounded-full px-4 py-2"
    >
      <span className="font-inter-tight text-base font-semibold leading-none text-[#ff3838]">
        Sair da conta
      </span>
      <LogOut className="size-4 text-[#ff3838]" />
    </button>
  );
};
