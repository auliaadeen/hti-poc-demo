"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  emailSetupRequestsSeed,
  mulaiSetup,
  cekStatusVerifikasi,
  konfirmasiAliasManual,
  simulasikanGagal,
  cobaLagi,
  type EmailSetupRequest,
} from "@/lib/emailSetupData";
import { useMiniSlack } from "@/lib/MiniSlackContext";

type Provider = "cloudflare" | "brevo";

type CredentialState = { saved: boolean; masked: string };

type EmailSetupContextValue = {
  unlocked: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  requests: EmailSetupRequest[];
  createRequest: (input: { personalEmail: string; targetDomainEmail: string; displayName: string }) => Promise<EmailSetupRequest>;
  advance: (id: string) => Promise<void>;
  confirmAlias: (id: string) => Promise<void>;
  retry: (id: string) => Promise<void>;
  simulateFail: (id: string) => Promise<void>;

  credentials: Record<Provider, CredentialState>;
  saveCredential: (provider: Provider, rawKey: string) => void;
  testConnection: (provider: Provider) => Promise<boolean>;
};

const EmailSetupContext = createContext<EmailSetupContextValue | null>(null);

function maskKey(raw: string): string {
  if (raw.length <= 4) return "•".repeat(raw.length);
  return "•".repeat(Math.min(8, raw.length - 4)) + raw.slice(-4);
}

// In-memory saja — mock mode, sesuai pola AuthContext.tsx. Isolasi dari AuthContext
// utama karena modul ini punya login sendiri (spec Bab 3: "Isolasi akses").
export function EmailSetupProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [requests, setRequests] = useState<EmailSetupRequest[]>(emailSetupRequestsSeed);
  const [credentials, setCredentials] = useState<Record<Provider, CredentialState>>({
    cloudflare: { saved: false, masked: "" },
    brevo: { saved: false, masked: "" },
  });
  const { post } = useMiniSlack();

  function login(email: string, password: string): boolean {
    if (!email.trim() || !password.trim()) return false;
    setUnlocked(true);
    return true;
  }

  function logout() {
    setUnlocked(false);
  }

  function updateRequest(updated: EmailSetupRequest) {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  async function createRequest(input: { personalEmail: string; targetDomainEmail: string; displayName: string }) {
    const req = await mulaiSetup(input);
    setRequests((prev) => [req, ...prev]);
    return req;
  }

  async function advance(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const updated = await cekStatusVerifikasi(req);
    updateRequest(updated);
    post("email-setup", `✉️ Request ${updated.targetDomainEmail} naik status ke ${updated.status}`);
  }

  async function confirmAlias(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const updated = await konfirmasiAliasManual(req);
    updateRequest(updated);
    post("email-setup", `✉️ Request ${updated.targetDomainEmail} naik status ke ${updated.status}`);
  }

  async function retry(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const updated = await cobaLagi(req);
    updateRequest(updated);
  }

  async function simulateFail(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const updated = await simulasikanGagal(req);
    updateRequest(updated);
  }

  function saveCredential(provider: Provider, rawKey: string) {
    if (!rawKey.trim()) return;
    setCredentials((prev) => ({ ...prev, [provider]: { saved: true, masked: maskKey(rawKey.trim()) } }));
  }

  async function testConnection(provider: Provider): Promise<boolean> {
    const ok = credentials[provider].saved;
    await new Promise((resolve) => setTimeout(resolve, 700));
    return ok;
  }

  return (
    <EmailSetupContext.Provider
      value={{
        unlocked,
        login,
        logout,
        requests,
        createRequest,
        advance,
        confirmAlias,
        retry,
        simulateFail,
        credentials,
        saveCredential,
        testConnection,
      }}
    >
      {children}
    </EmailSetupContext.Provider>
  );
}

export function useEmailSetup() {
  const ctx = useContext(EmailSetupContext);
  if (!ctx) throw new Error("useEmailSetup must be used within EmailSetupProvider");
  return ctx;
}
