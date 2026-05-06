import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/data";

const links = [
  { label: "email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { label: "github", value: `@${site.contact.github}`, href: `https://github.com/${site.contact.github}` },
  { label: "linkedin", value: site.contact.linkedin, href: `https://linkedin.com/in/${site.contact.linkedin}` },
  { label: "contact page", value: "/contact", href: "/contact" },
];

export function ContactCTA() {
  return (
    <section className="bg-white py-24 sm:py-32" data-theme="light">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <h2 className="font-semibold tracking-[-0.04em] leading-[0.98] text-[clamp(56px,11vw,144px)]">
          Let&apos;s build the <span className="text-lime">future.</span>
        </h2>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-y-2 max-w-3xl">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                prefetch={l.href.startsWith("/")}
                className="group flex items-center justify-between py-3 border-b border-black/10 hover:border-lime transition-colors"
                data-cursor
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/50">
                  // {l.label}
                </span>
                <span className="flex items-center gap-3 text-sm sm:text-base text-black">
                  {l.value}
                  <ArrowRight
                    size={14}
                    className="text-lime transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-24 pt-6 border-t border-black/10 flex items-center justify-between">
          <p className="font-mono text-[11px] text-black/40">
            © 2025 {site.name}
          </p>
          <p className="font-mono text-[11px] text-black/40">
            // built with next, framer, recharts &amp; lime
          </p>
        </div>
      </div>
    </section>
  );
}
