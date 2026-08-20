"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CHANNELS, formatRelativeTime, type ChannelSlug } from "@/lib/miniSlackData";
import { useMiniSlack } from "@/lib/MiniSlackContext";
import { cn } from "@/lib/utils";

// Dipakai bareng oleh MiniSlackPanel (sidebar) dan /chat (halaman penuh) —
// biar logic render channel + pesan gak duplikat (spec Bab 11.4).
export function MiniSlackChannelView({
  variant = "full",
  limit,
}: {
  variant?: "full" | "preview";
  limit?: number;
}) {
  const { messages, postManual } = useMiniSlack();
  const [channel, setChannel] = useState<ChannelSlug>("general");
  const [draft, setDraft] = useState("");

  const activeChannel = variant === "preview" ? "general" : channel;
  const filtered = messages.filter((m) => activeChannel === "general" || m.channelSlug === activeChannel);
  const shown = limit ? filtered.slice(-limit) : filtered;

  function kirim() {
    if (!draft.trim()) return;
    postManual(activeChannel === "general" ? "general" : activeChannel, draft.trim());
    setDraft("");
  }

  return (
    <div className={cn("flex", variant === "full" ? "h-full min-h-0" : "flex-col")}>
      {variant === "full" && (
        <div className="w-36 shrink-0 border-r border-neutral-200 dark:border-neutral-800 pr-2">
          {CHANNELS.map((c) => (
            <button
              key={c.slug}
              onClick={() => setChannel(c.slug)}
              className={cn(
                "block w-full rounded-lg px-2.5 py-1.5 text-left text-sm",
                channel === c.slug
                  ? "bg-neutral-200 dark:bg-neutral-800 font-medium text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className={cn("flex min-w-0 flex-1 flex-col", variant === "full" && "pl-3")}>
        <div className={cn("space-y-3 overflow-y-auto", variant === "full" ? "flex-1" : "max-h-72")}>
          {shown.length === 0 && <p className="text-sm text-neutral-500">Belum ada pesan.</p>}
          {shown.map((m) => (
            <div key={m.id} className="text-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-neutral-900 dark:text-white">
                  {m.author === "deen" ? "Deen" : "bot"}
                </span>
                <span className="text-xs text-neutral-500" suppressHydrationWarning>
                  {formatRelativeTime(m.createdAt)}
                </span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">{m.content}</p>
            </div>
          ))}
        </div>

        {variant === "full" && (
          <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && kirim()}
              placeholder={`Catatan manual ke ${CHANNELS.find((c) => c.slug === channel)?.name}...`}
              className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm"
            />
            <button
              onClick={kirim}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
