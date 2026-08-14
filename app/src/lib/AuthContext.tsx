"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Admin" | "Viewer";

type AuthContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// In-memory saja (bukan localStorage/cookie) — mock role switch untuk demo,
// bukan sesi autentikasi sungguhan. Reset begitu halaman di-reload penuh.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  return <AuthContext.Provider value={{ role, setRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
