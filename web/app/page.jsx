"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/Spinner";

export default function RootPage() {
  const { ready, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/chat" : "/login");
  }, [ready, user, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-paper text-ink-soft">
      <Spinner className="h-5 w-5" />
    </div>
  );
}
