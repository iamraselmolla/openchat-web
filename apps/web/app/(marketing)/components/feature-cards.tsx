"use client";

import { motion } from "framer-motion";
import { Code2, GitBranch, MessagesSquare, Search, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Real-time streaming",
    description: "Watch answers appear token by token instead of waiting for a wall of text.",
  },
  {
    icon: Code2,
    title: "Code that renders correctly",
    description: "Syntax-highlighted code blocks with one-click copy, for every language you use.",
  },
  {
    icon: GitBranch,
    title: "Editable history",
    description: "Edit an earlier message and the conversation branches from that point forward.",
  },
  {
    icon: Search,
    title: "Instant chat search",
    description: "Find any past conversation by title in a fraction of a second.",
  },
  {
    icon: MessagesSquare,
    title: "Full markdown support",
    description: "Tables, lists, and formatting render exactly as they were written.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, your control",
    description: "Conversations are private to your account and can be deleted at any time.",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="container py-24">
      <div className="mx-auto mb-14 max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for how you actually work</h2>
        <p className="mt-3 text-muted-foreground">Every detail is tuned for long, real conversations, not demos.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/30"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <feature.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="mb-1.5 font-medium">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
