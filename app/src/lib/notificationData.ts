// Data model buat Notification Channels (spec Part 2 Bab 14). Mock-first,
// sama pola kayak modul lain — gak ada panggilan Discord/SMTP beneran.

export type NotificationChannelType = "discord" | "email" | "tally";

export type NotificationEventType =
  | "document.processed"
  | "payroll.finalized"
  | "email_setup.status_changed";

export type DeliveryStatus = "sent" | "skipped";

export type DeliveryLogEntry = {
  id: string;
  eventType: NotificationEventType;
  channelType: "discord" | "email";
  content: string;
  status: DeliveryStatus;
  createdAt: string;
};

export const EVENT_LABELS: Record<NotificationEventType, string> = {
  "document.processed": "Dokumen Diproses",
  "payroll.finalized": "Payroll Difinalisasi",
  "email_setup.status_changed": "Email Setup Status Berubah",
};

export const CHANNEL_LABELS: Record<NotificationChannelType, string> = {
  discord: "Discord",
  email: "Email/SMTP",
  tally: "Tally",
};
