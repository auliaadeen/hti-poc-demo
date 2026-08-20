"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { miniSlackSeed, type Message, type ChannelSlug } from "@/lib/miniSlackData";
import { useNotifications } from "@/lib/NotificationContext";
import type { NotificationEventType } from "@/lib/notificationData";

type MiniSlackContextValue = {
  messages: Message[];
  post: (channelSlug: ChannelSlug, content: string, eventType?: NotificationEventType, meta?: string) => void;
  postManual: (channelSlug: ChannelSlug, content: string) => void;
  panelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
};

const MiniSlackContext = createContext<MiniSlackContextValue | null>(null);

let msgCounter = 0;
function nextMsgId(): string {
  msgCounter += 1;
  return `MSG-${String(msgCounter).padStart(3, "0")}`;
}

// Global provider (root layout) — Command Center dan tiap modul (Document AI,
// Payroll, Email Setup) semua nulis/baca dari sini. In-memory saja, sama pola
// AuthContext/EmailSetupContext.
export function MiniSlackProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(miniSlackSeed);
  const [panelOpen, setPanelOpen] = useState(false);
  const { dispatch } = useNotifications();

  function addMessage(channelSlug: ChannelSlug, author: Message["author"], content: string, meta?: string) {
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), channelSlug, author, content, meta, createdAt: new Date().toISOString() },
    ]);
  }

  // eventType opsional: kalau diisi, event ini juga di-fan-out ke Discord/Email
  // (kalau dikonfigurasi) lewat NotificationContext — "satu event, dua tujuan"
  // (spec Bab 14.3).
  function post(channelSlug: ChannelSlug, content: string, eventType?: NotificationEventType, meta?: string) {
    addMessage(channelSlug, "system", content, meta);
    if (eventType) dispatch(eventType, content);
  }

  function postManual(channelSlug: ChannelSlug, content: string) {
    addMessage(channelSlug, "deen", content);
  }

  return (
    <MiniSlackContext.Provider
      value={{
        messages,
        post,
        postManual,
        panelOpen,
        togglePanel: () => setPanelOpen((v) => !v),
        closePanel: () => setPanelOpen(false),
      }}
    >
      {children}
    </MiniSlackContext.Provider>
  );
}

export function useMiniSlack() {
  const ctx = useContext(MiniSlackContext);
  if (!ctx) throw new Error("useMiniSlack must be used within MiniSlackProvider");
  return ctx;
}
