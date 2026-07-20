"use client";

import { motion } from "framer-motion";

const STEPS = [
  { title: "Ask anything", description: "Type a question, paste some code, or describe a problem in plain language." },
  { title: "Watch it think in real time", description: "Aria streams its answer as it's generated, so you're never staring at a blank screen." },
  { title: "Refine the thread", description: "Edit a message, ask a follow-up, or regenerate a response — the conversation adapts." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/40 py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Three steps, start to finish</h2>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-5 top-2 hidden h-[calc(100%-2rem)] w-px bg-border sm:block" />
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex gap-5 sm:pl-0"
              >
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-sm text-accent">
                  {i + 1}
                </div>
                <div className="pt-1.5">
                  <h3 className="mb-1 font-medium">{step.title}</h3>
                  <p className="max-w-md text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
