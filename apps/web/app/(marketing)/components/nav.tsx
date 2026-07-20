"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Aria</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat">Sign in</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link href="/chat">Start for free</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Button variant="accent" size="sm" asChild className="mt-2">
              <Link href="/chat">Start for free</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
