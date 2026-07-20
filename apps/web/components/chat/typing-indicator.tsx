export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2" aria-label="Assistant is typing">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground [animation-delay:400ms]" />
    </div>
  );
}
