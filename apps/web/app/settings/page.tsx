"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, Laptop, Moon, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], action: "Open command menu" },
  { keys: ["Ctrl", "Shift", "O"], action: "Start a new chat" },
  { keys: ["Enter"], action: "Send message" },
  { keys: ["Shift", "Enter"], action: "New line in composer" },
  { keys: ["Esc"], action: "Stop generation" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { aiSettings, setAiSettings } = useChatStore();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <Link href="/chat" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </Link>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Settings</h1>

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ai">AI settings</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose how Aria looks on this device.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-sm transition-colors hover:border-accent/40",
                    theme === value && "border-accent bg-accent/5 text-accent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model behavior</CardTitle>
              <CardDescription>Applies to new messages sent from this browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Temperature</span>
                  <span className="font-mono text-muted-foreground">{aiSettings.temperature.toFixed(1)}</span>
                </div>
                <Slider
                  value={[aiSettings.temperature]}
                  min={0}
                  max={2}
                  step={0.1}
                  onValueChange={([v]) => setAiSettings({ temperature: v })}
                />
                <p className="text-xs text-muted-foreground">Lower is more focused, higher is more creative.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Max tokens</span>
                  <span className="font-mono text-muted-foreground">{aiSettings.maxTokens}</span>
                </div>
                <Slider
                  value={[aiSettings.maxTokens]}
                  min={256}
                  max={4096}
                  step={128}
                  onValueChange={([v]) => setAiSettings({ maxTokens: v })}
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">System prompt</span>
                <Textarea
                  value={aiSettings.systemPrompt ?? ""}
                  onChange={(e) => setAiSettings({ systemPrompt: e.target.value })}
                  placeholder="You are a helpful, concise assistant..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {SHORTCUTS.map((s) => (
                <div key={s.action} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-muted-foreground">{s.action}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
