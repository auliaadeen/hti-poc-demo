"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { NotificationChannelType, NotificationEventType, DeliveryLogEntry } from "@/lib/notificationData";

type ChannelState = { saved: boolean; masked: string; enabled: boolean };

type DispatchTarget = "discord" | "email";

type RuleMap = Record<NotificationEventType, Record<DispatchTarget, boolean>>;

type NotificationContextValue = {
  channels: Record<NotificationChannelType, ChannelState>;
  rules: RuleMap;
  deliveryLog: DeliveryLogEntry[];
  saveChannelConfig: (type: NotificationChannelType, rawSummary: string) => void;
  toggleChannelEnabled: (type: NotificationChannelType) => void;
  toggleRule: (eventType: NotificationEventType, channel: DispatchTarget) => void;
  testChannel: (type: NotificationChannelType) => Promise<boolean>;
  dispatch: (eventType: NotificationEventType, content: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function maskValue(raw: string): string {
  if (raw.length <= 4) return "•".repeat(raw.length);
  return "•".repeat(Math.min(8, raw.length - 4)) + raw.slice(-4);
}

let logCounter = 0;
function nextLogId(): string {
  logCounter += 1;
  return `LOG-${String(logCounter).padStart(3, "0")}`;
}

const EMPTY_CHANNEL: ChannelState = { saved: false, masked: "", enabled: false };

// In-memory saja, mock mode — sama pola kayak EmailSetupContext.tsx. Ini
// dipasang SEBELUM MiniSlackProvider di layout.tsx karena MiniSlack.post()
// manggil dispatch() dari sini (spec Bab 14.3: "satu event, dua tujuan").
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Record<NotificationChannelType, ChannelState>>({
    discord: EMPTY_CHANNEL,
    email: EMPTY_CHANNEL,
    tally: EMPTY_CHANNEL,
  });
  const [rules, setRules] = useState<RuleMap>({
    "document.processed": { discord: false, email: false },
    "payroll.finalized": { discord: false, email: false },
    "email_setup.status_changed": { discord: false, email: false },
  });
  const [deliveryLog, setDeliveryLog] = useState<DeliveryLogEntry[]>([]);

  function saveChannelConfig(type: NotificationChannelType, rawSummary: string) {
    if (!rawSummary.trim()) return;
    setChannels((prev) => ({ ...prev, [type]: { ...prev[type], saved: true, masked: maskValue(rawSummary.trim()) } }));
  }

  function toggleChannelEnabled(type: NotificationChannelType) {
    setChannels((prev) => ({ ...prev, [type]: { ...prev[type], enabled: !prev[type].enabled } }));
  }

  function toggleRule(eventType: NotificationEventType, channel: DispatchTarget) {
    setRules((prev) => ({
      ...prev,
      [eventType]: { ...prev[eventType], [channel]: !prev[eventType][channel] },
    }));
  }

  async function testChannel(type: NotificationChannelType): Promise<boolean> {
    const ok = channels[type].saved;
    await new Promise((resolve) => setTimeout(resolve, 700));
    return ok;
  }

  function dispatch(eventType: NotificationEventType, content: string) {
    (["discord", "email"] as DispatchTarget[]).forEach((channelType) => {
      const enabled = rules[eventType][channelType] && channels[channelType].enabled && channels[channelType].saved;
      setDeliveryLog((prev) => [
        {
          id: nextLogId(),
          eventType,
          channelType,
          content,
          status: enabled ? "sent" : "skipped",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
  }

  return (
    <NotificationContext.Provider
      value={{ channels, rules, deliveryLog, saveChannelConfig, toggleChannelEnabled, toggleRule, testChannel, dispatch }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
