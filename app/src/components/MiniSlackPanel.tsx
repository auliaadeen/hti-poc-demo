"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { useMiniSlack } from "@/lib/MiniSlackContext";
import { MiniSlackChannelView } from "@/components/MiniSlackChannelView";

// Global floating toggle + slide-in sidebar — dipasang sekali di root layout,
// jadi persist across semua halaman (spec Bab 11.4). Ditaruh pojok kanan-bawah
// biar gak nabrak AccountBadge/ThemeToggle/ActivityFeed yang biasanya di pojok
// kanan-atas tiap halaman.
export function MiniSlackPanel() {
  const { panelOpen, togglePanel, closePanel } = useMiniSlack();

  return (
    <>
      <button
        onClick={togglePanel}
        aria-label="Buka Mini Slack"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg hover:bg-blue-600"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {panelOpen && (
          <>
            <button
              aria-label="Tutup Mini Slack"
              onClick={closePanel}
              className="fixed inset-0 z-40 bg-black/20"
            />
            <motion.div
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Mini Slack</p>
                <button onClick={closePanel} aria-label="Tutup" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <MiniSlackChannelView variant="full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
