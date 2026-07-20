"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For trying Aria out on everyday questions.",
    features: ["50 messages per day", "GPT-4o mini", "Chat history", "Community support"],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "per month",
    description: "For daily writing, coding, and research work.",
    features: [
      "Unlimited messages",
      "Access to the latest models",
      "Adjustable temperature and system prompts",
      "Priority response speed",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$18",
    period: "per user / month",
    description: "For teams that share context and workflows.",
    features: ["Everything in Pro", "Shared workspace history", "Admin controls", "Usage analytics", "Priority support"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="container py-24">
      <div className="mx-auto mb-14 max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing, no surprises</h2>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade only when you need more.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border p-6",
              plan.highlighted ? "border-accent bg-accent/5 shadow-lg shadow-accent/10" : "border-border bg-card",
            )}
          >
            {plan.highlighted && (
              <Badge variant="accent" className="mb-4 w-fit">
                Most popular
              </Badge>
            )}
            <h3 className="font-medium">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

            <ul className="my-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button variant={plan.highlighted ? "accent" : "outline"} asChild>
              <Link href="/chat">{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
