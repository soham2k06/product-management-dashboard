"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, isMounted, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Product Management System
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Test credentials:</p>
            <p className="mt-1 font-mono text-xs">
              Username: <span className="text-foreground">emilys</span>
            </p>
            <p className="font-mono text-xs">
              Password: <span className="text-foreground">emilyspass</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
