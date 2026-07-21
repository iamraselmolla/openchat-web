"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";

export default function ChatLayout({ children }) {
  const { ready, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  // Not ready yet, or we know there's no user and a redirect is in flight —
  // never render the chat shell in either case.
  if (!ready || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-ink-soft">
        <Spinner className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
