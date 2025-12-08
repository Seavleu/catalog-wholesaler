"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { base44 } from "@/app/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await base44.auth.login({ email, password });
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ចូលគណនី
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            ប្រើអ៊ីមែល និងពាក្យសម្ងាត់ Supabase ដែលបានបង្កើត
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">អ៊ីមែល</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-11 text-base"
              />
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
              disabled={loading}
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

