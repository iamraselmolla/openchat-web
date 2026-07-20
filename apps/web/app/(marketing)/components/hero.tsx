"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_EXCHANGE = {
  user: "Summarize this quarter's user growth in three bullet points.",
  assistant:
    "Here's the summary:\n\n- Signups grew 34% quarter over quarter\n- Activation rate improved from 41% to 52%\n- Weekly retention held steady at 68%",
};

/** The signature element: a small, self-playing chat transcript that types itself out. */
function LiveDemo() {
  const [typedUser, setTypedUser] = useState("");
  const [typedAssistant, setTypedAssistant] = useState("");
  const [phase, setPhase] = useState<"user" | "pause" | "assistant" | "done">("user");

  useEffect(() => {
    let i = 0;
    if (phase !== "user") return;
    const id = setInterval(() => {
      i += 1;
      setTypedUser(DEMO_EXCHANGE.user.slice(0, i));
      if (i >= DEMO_EXCHANGE.user.length) {
        clearInterval(id);
        setTimeout(() => setPhase("assistant"), 500);
      }
    }, 22);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    let i = 0;
    if (phase !== "assistant") return;
    const id = setInterval(() => {
      i += 1;
      setTypedAssistant(DEMO_EXCHANGE.assistant.slice(0, i));
      if (i >= DEMO_EXCHANGE.assistant.length) {
        clearInterval(id);
        setPhase("done");
      }
    }, 14);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="glass w-full max-w-md rounded-2xl border border-border p-4 shadow-xl shadow-black/5">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">Aria — live preview</span>
      </div>
      <div className="space-y-3">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          {typedUser}
          {phase === "user" && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse-dot bg-primary-foreground align-middle" />}
        </div>
        {(phase === "assistant" || phase === "done") && (
          <div className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-2.5 text-sm">
            {typedAssistant}
            {phase === "assistant" && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse-dot bg-foreground align-middle" />}
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-14 pb-24 pt-16 md:pt-24 lg:flex-row lg:items-center lg:gap-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 text-center lg:text-left"
      >
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Now streaming responses in real time
        </div>
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Think out loud with an AI that keeps up.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground lg:mx-0">
          Aria answers in real time, remembers the thread of a conversation, and formats code, tables, and
          lists the way you'd want them written yourself.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
          <Button size="lg" variant="accent" asChild>
            <Link href="/chat">
              Start chatting free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free tier included</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 justify-center"
      >
        <LiveDemo />
      </motion.div>
    </section>
  );
}
