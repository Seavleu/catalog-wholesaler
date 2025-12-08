"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Settings, LogOut, User } from "lucide-react";
import GlobalSearch from "@/app/components/layout/GlobalSearch";
import { app } from "@/app/api/appClient";

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
    app.auth
      .me()
      .then((u) => setUser(u as UserType | null))
      .catch(() => setUser(null));
  }, []);

  const canManage = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="min-h-screen bg-white" dir="ltr">
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          {user ? (
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-lg sm:text-xl md:text-2xl font-semibold text-white hover:text-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
              >
                MeyMey Sport
              </Link>
              <div className="flex-1 max-w-md mx-2 sm:mx-4">
                <GlobalSearch />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-shrink-0">
                <Link
                  href="/profile"
                  className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1.5 px-1 sm:px-0"
                  title="គណនី"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">គណនី</span>
                </Link>
                {canManage && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1.5 px-1 sm:px-0"
                    title={user.role === "manager" ? "គ្រប់គ្រងផលិតផល" : "គ្រប់គ្រង"}
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">
                      {user.role === "manager"
                        ? "គ្រប់គ្រងផលិតផល"
                        : "គ្រប់គ្រង"}
                    </span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => app.auth.logout()}
                  className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1.5 px-1 sm:px-0"
                  title="ចាកចេញ"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">ចាកចេញ</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-lg sm:text-xl md:text-2xl font-semibold text-white hover:text-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
              >
                MeyMey Sport
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 sm:gap-2 text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">ចូលគណនី</span>
                <span className="sm:hidden">ចូល</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}


