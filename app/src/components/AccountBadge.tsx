"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export function AccountBadge({ className }: { className?: string }) {
  const { role } = useAuth();

  return (
    <Link
      href="/login"
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
        className
      )}
    >
      <User className="h-3.5 w-3.5" />
      {role ?? "Masuk"}
    </Link>
  );
}
