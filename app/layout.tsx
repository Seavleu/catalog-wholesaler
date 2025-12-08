import React, { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/app/components/layout/AppShell";
import { ToastProvider } from "@/components/providers/ToastProvider";
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
    <html lang="km" className={notoSansKhmer.variable}>
      <body className="min-h-screen bg-white font-khmer" dir="ltr">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
