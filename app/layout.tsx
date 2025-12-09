import React, { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/app/components/layout/AppShell";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Noto_Sans_Khmer } from "next/font/google";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

export const metadata = {
  title: "MeyMey Sport",
  description: "Sport product catalog management",
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="km" className={notoSansKhmer.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-khmer" dir="ltr">
        <ThemeProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
