"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { app } from "@/app/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, LogIn, Mail, Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Detect if input is email or phone
  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isEmail(identifier)) {
        // Admin login with email
        await app.auth.login({ email: identifier, password });
      } else {
        // User login with phone
        await app.auth.login({ phone: identifier, password });
      }
      router.push("/catalog");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ចូលគណនី
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            អ្នកគ្រប់គ្រង: ប្រើអ៊ីមែល | អ្នកប្រើប្រាស់: ប្រើលេខទូរស័ព្ទ
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {isEmail(identifier) ? (
                  <>
                    <Mail className="w-4 h-4" />
                    អ៊ីមែល (Admin)
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    លេខទូរស័ព្ទ (User)
                  </>
                )}
              </label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isEmail(identifier) ? "admin@meymeysport.com" : "012345678"}
                required
                className="h-11 text-base"
              />
              <p className="text-xs text-gray-500">
                {isEmail(identifier)
                  ? "ប្រើអ៊ីមែលសម្រាប់អ្នកគ្រប់គ្រង"
                  : "ប្រើលេខទូរស័ព្ទសម្រាប់អ្នកប្រើប្រាស់ (ឧ. 012345678)"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ពាក្យសម្ងាត់</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 text-base"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base gap-2"
              disabled={loading || !identifier || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  កំពុងចូល...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  ចូលគណនី
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

