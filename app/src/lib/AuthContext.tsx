"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Admin" | "Viewer" | "Karyawan";

type AuthContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  employeeId: string | null;
  setEmployeeId: (id: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// In-memory saja (bukan localStorage/cookie) — mock role switch untuk demo,
// bukan sesi autentikasi sungguhan. Reset begitu halaman di-reload penuh.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ role, setRole, employeeId, setEmployeeId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
