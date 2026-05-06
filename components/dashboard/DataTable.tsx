"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  render: (row: T) => React.ReactNode;
  sort?: (a: T, b: T) => number;
};

export function DataTable<T extends { id: string; href?: string }>({
  rows,
  columns,
  defaultSort,
  pageSize,
}: {
  rows: T[];
  columns: Column<T>[];
  defaultSort?: { key: string; dir: "asc" | "desc" };
  pageSize?: number;
}) {
  const [sortKey, setSortKey] = useState<string | null>(
    defaultSort?.key ?? null
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">(
    defaultSort?.dir ?? "asc"
  );

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sort) return rows;
    const next = [...rows].sort(col.sort);
    return sortDir === "asc" ? next : next.reverse();
  }, [rows, columns, sortKey, sortDir]);

  const visible = pageSize ? sorted.slice(0, pageSize) : sorted;

  const onSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sortKey === c.key;
              return (
                <th
                  key={c.key}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.1em] text-white/45 py-2 px-3 border-b border-white/10 whitespace-nowrap",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center"
                  )}
                  style={{ width: c.width }}
                >
                  {c.sort ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 hover:text-white transition-colors",
                        active && "text-lime"
                      )}
                    >
                      {c.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={11} />
                        ) : (
                          <ArrowDown size={11} />
                        )
                      ) : (
                        <ArrowUpDown size={11} className="opacity-50" />
                      )}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => {
            const tdClass = (c: Column<T>) =>
              cn(
                "py-2.5 px-3 border-b border-white/5 align-middle",
                c.align === "right" && "text-right",
                c.align === "center" && "text-center"
              );
            if (row.href) {
              return (
                <tr
                  key={row.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {columns.map((c, i) => (
                    <td key={c.key} className={tdClass(c)}>
                      <Link
                        href={row.href!}
                        prefetch
                        className={cn(
                          "block",
                          i === 0
                            ? "text-white group-hover:text-lime"
                            : "text-white/85"
                        )}
                        data-cursor
                      >
                        {c.render(row)}
                      </Link>
                    </td>
                  ))}
                </tr>
              );
            }
            return (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key} className={tdClass(c)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {visible.length === 0 && (
        <p className="font-mono text-xs text-white/40 text-center py-8">
          // no rows
        </p>
      )}
    </div>
  );
}
