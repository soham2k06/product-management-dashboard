"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, type HeaderProps } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

interface DashboardLayoutProps extends HeaderProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
  title,
  search,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isMounted, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Main content */}
        <Header title={title} search={search} />

        {/* Page content */}

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
