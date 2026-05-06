"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CodeBlock({
  filename,
  language,
  code,
}: {
  filename: string;
  language: string;
  code: string;
}) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { codeToHtml } = await import("shiki");
        const out = await codeToHtml(code, {
          lang: language,
          theme: "github-dark-default",
        });
        if (!cancelled) setHtml(out);
      } catch {
        if (!cancelled) setHtml(null);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard ✓");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-black/15 bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-lime">
            // {filename}
          </span>
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.1em]">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60 hover:text-lime transition-colors"
          aria-label="Copy code"
          data-cursor
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      {html ? (
        <div
          // shiki output of a controlled server-side code constant.
          dangerouslySetInnerHTML={{ __html: html }}
          className="overflow-x-auto p-5 text-[13px] leading-[1.6] [&_pre]:bg-transparent [&_pre]:m-0"
        />
      ) : (
        <pre className="overflow-x-auto p-5 text-[13px] leading-[1.6] text-white/85 font-mono">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
