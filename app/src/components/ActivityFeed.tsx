"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { activityFeed } from "@/lib/activityData";

export function ActivityFeed({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Notifikasi aktivitas"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
          {activityFeed.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              aria-label="Tutup notifikasi"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Aktivitas Terbaru
              </p>
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {activityFeed.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-2.5 rounded-lg px-1.5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", item.iconClass)} />
                      <div className="min-w-0">
                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{item.message}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">{item.relativeTime}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
