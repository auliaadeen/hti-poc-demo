import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/AuthContext";
import { MiniSlackProvider } from "@/lib/MiniSlackContext";
import { MiniSlackPanel } from "@/components/MiniSlackPanel";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTI Digital Operations — PoC Demo",
  description: "Demo internal ITS untuk assessment/PoC HTI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HTI PoC",
  },
};

export const viewport: Viewport = {
  themeColor: "#b91c1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            <MiniSlackProvider>
              {children}
              <MiniSlackPanel />
            </MiniSlackProvider>
          </AuthProvider>
        </ThemeProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
