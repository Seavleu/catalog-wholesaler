"use client";

import { ToastProvider as BaseToastProvider } from "@/components/ui/toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <BaseToastProvider>{children}</BaseToastProvider>;
}

