"use client";

import { MiniSlackChannelView } from "@/components/MiniSlackChannelView";

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col bg-white px-6 py-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 md:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col min-h-0">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Mini Slack</p>
        <h1 className="mt-1 text-2xl font-bold">Semua event, satu tempat.</h1>

        <div className="mt-6 min-h-0 flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <MiniSlackChannelView variant="full" />
        </div>
      </div>
    </main>
  );
}
