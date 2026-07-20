"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose-chat text-sm leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const isInline = !match;
            if (isInline) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match?.[1] ?? ""} code={String(children).replace(/\n$/, "")} />;
          },
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b border-border bg-muted px-3 py-2 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-b border-border px-3 py-2">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-accent pl-4 text-muted-foreground last:mb-0">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
