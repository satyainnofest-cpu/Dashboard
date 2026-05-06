"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";

const CARD =
  "group block text-left border border-white/10 rounded-lg p-5 bg-white/[0.015] hover:border-lime transition-colors";

export function ContactCards({
  email,
  github,
  linkedin,
}: {
  email: string;
  github: string;
  linkedin: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <EmailCard email={email} />
      <GithubCard username={github} />
      <LinkedInCard slug={linkedin} />
    </div>
  );
}

function EmailCard({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied ✓");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Try selecting manually.");
    }
  };

  return (
    <button type="button" onClick={onClick} data-cursor className={CARD}>
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          // email
        </p>
        <Mail size={14} className="text-white/45 group-hover:text-lime" />
      </div>
      <p
        className={cn(
          "text-lg sm:text-xl font-semibold tracking-[-0.01em] transition-colors break-all",
          copied && "text-lime"
        )}
      >
        {email}
      </p>
      <p className="mt-3 font-mono text-[10px] text-white/40">
        {copied ? "// copied to clipboard" : "// click to copy"}
      </p>
    </button>
  );
}

function GithubCard({ username }: { username: string }) {
  const [latest, setLatest] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!hovered || tried) return;
    setTried(true);
    const cacheKey = `gh:${username}:latest`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setLatest(cached);
        return;
      }
    } catch {
      /* sessionStorage unavailable */
    }
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=1&sort=updated`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data[0]?.name) {
          setLatest(data[0].name);
          try {
            sessionStorage.setItem(cacheKey, data[0].name);
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        // graceful fallback — UI shows "View profile →"
      });
  }, [hovered, tried, username]);

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor
      onMouseEnter={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      className={CARD}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          // github
        </p>
        <GithubIcon size={14} className="text-white/55 group-hover:text-lime" />
      </div>
      <p className="text-lg sm:text-xl font-semibold tracking-[-0.01em]">
        @{username}
      </p>
      <p className="mt-3 font-mono text-[10px] text-white/40 inline-flex items-center gap-1">
        {latest ? (
          <>// latest: {latest}</>
        ) : (
          <>
            View profile <ArrowUpRight size={10} />
          </>
        )}
      </p>
    </a>
  );
}

function LinkedInCard({ slug }: { slug: string }) {
  return (
    <a
      href={`https://linkedin.com/in/${slug}`}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor
      className={CARD}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          // linkedin
        </p>
        <LinkedInIcon
          size={14}
          className="text-white/45 group-hover:text-lime"
        />
      </div>
      <p className="text-lg sm:text-xl font-semibold tracking-[-0.01em]">
        {slug}
      </p>
      <p className="mt-3 font-mono text-[10px] text-white/40 inline-flex items-center gap-1">
        Open profile <ArrowUpRight size={10} />
      </p>
    </a>
  );
}
