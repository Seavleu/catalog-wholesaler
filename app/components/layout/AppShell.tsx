"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Settings, LogOut, User } from "lucide-react";
import GlobalSearch from "@/app/components/layout/GlobalSearch";
import ThemeToggle from "@/app/components/layout/ThemeToggle";
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
    <div className="min-h-screen bg-background" dir="ltr">
      <div className="bg-primary text-primary-foreground border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          {user ? (
            <>
              {/* Mobile Layout: Stacked */}
              <div className="flex flex-col space-y-2 sm:hidden">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href="/"
                    className="text-lg font-semibold text-primary-foreground hover:opacity-80 transition-opacity whitespace-nowrap"
                  >
                    MeyMey Sport
                  </Link>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <ThemeToggle />
                    <Link
                      href="/profile"
                      className="p-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      title="គណនី"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    {canManage && (
                      <Link
                        href="/admin"
                        className="p-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                        title={user.role === "manager" ? "គ្រប់គ្រងផលិតផល" : "គ្រប់គ្រង"}
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => app.auth.logout()}
                      className="p-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      title="ចាកចេញ"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <GlobalSearch />
              </div>
              {/* Desktop Layout: Horizontal */}
              <div className="hidden sm:flex items-center justify-between gap-2 sm:gap-4">
                <Link
                  href="/"
                  className="text-xl md:text-2xl font-semibold text-primary-foreground hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
                >
                  MeyMey Sport
                </Link>
                <div className="flex-1 max-w-md mx-2 sm:mx-4">
                  <GlobalSearch />
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <ThemeToggle />
                  <Link
                    href="/profile"
                    className="flex items-center gap-1 sm:gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base"
                    title="គណនី"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">គណនី</span>
                  </Link>
                  {canManage && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 sm:gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base"
                      title={user.role === "manager" ? "គ្រប់គ្រងផលិតផល" : "គ្រប់គ្រង"}
                    >
                      <Settings className="w-5 h-5" />
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
                    className="flex items-center gap-1 sm:gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base"
                    title="ចាកចេញ"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">ចាកចេញ</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-foreground hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
              >
                MeyMey Sport
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 sm:gap-2 bg-background text-foreground px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">ចូលគណនី</span>
                  <span className="sm:hidden">ចូល</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}


