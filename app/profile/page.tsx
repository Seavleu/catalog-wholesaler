"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Shield, LogOut, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { app } from "@/app/api/appClient";
import { UserEntity } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  admin: "អ្នកគ្រប់គ្រង",
  manager: "អ្នកគ្រប់គ្រងផលិតផល",
  user: "អ្នកប្រើប្រាស់",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-700",
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await app.auth.me();
        setUser(me);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          មិនមានគណនី
        </h1>
        <p className="text-gray-600">សូមចូលគណនីដើម្បីមើលព័ត៌មានផ្ទាល់ខ្លួន។</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="border-b bg-gray-50 rounded-t-2xl">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            គណនីរបស់ខ្ញុំ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.full_name || "អ្នកប្រើប្រាស់"}
              </h2>
              <Badge className={ROLE_COLORS[user.role || "user"]}>
                {ROLE_LABELS[user.role || "user"]}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4">
            {user.phone && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">លេខទូរស័ព្ទ</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">អ៊ីមែល</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">តួនាទី</p>
                <p className="font-medium text-gray-900">
                  {ROLE_LABELS[user.role || "user"]}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-3">
            {/* Catalog Navigation */}
            <Link href="/catalog" className="block">
              <Button
                className="w-full h-12 gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <ShoppingBag className="w-5 h-5" />
                មើលកាតាឡុកផលិតផល
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full h-12 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => app.auth.logout()}
            >
              <LogOut className="w-5 h-5" />
              ចាកចេញ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
