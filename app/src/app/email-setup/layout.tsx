import { EmailSetupProvider } from "@/lib/EmailSetupContext";

export default function EmailSetupLayout({ children }: { children: React.ReactNode }) {
  return <EmailSetupProvider>{children}</EmailSetupProvider>;
}
