import React, { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/app/components/layout/AppShell";

export const metadata = {
  title: "MeyMey Sport",
  description: "Sport product catalog management",
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white" dir="ltr">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
