"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Settings, LogOut, User } from "lucide-react";
import GlobalSearch from "@/app/components/layout/GlobalSearch";
import { base44 } from "@/app/api/base44Client";

type UserType = {
  id?: string;
  role?: "admin" | "manager" | "user";
  full_name?: string;
  email?: string;
};

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u as UserType | null))
      .catch(() => setUser(null));
  }, []);

  const canManage = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="min-h-screen bg-white" dir="ltr">
      {user && (
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <span className="text-gray-300 text-base whitespace-nowrap">
              សួស្តី, {user.full_name || user.email}
            </span>
            <GlobalSearch />
            <div className="flex items-center gap-5">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base py-1"
              >
                <User className="w-5 h-5" />
                គណនី
              </Link>
              {canManage && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base py-1"
                >
                  <Settings className="w-5 h-5" />
                  {user.role === "manager" ? "គ្រប់គ្រងផលិតផល" : "គ្រប់គ្រង"}
                </Link>
              )}
              <button
                type="button"
                onClick={() => base44.auth.logout()}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base py-1"
              >
                <LogOut className="w-5 h-5" />
                ចាកចេញ
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}


