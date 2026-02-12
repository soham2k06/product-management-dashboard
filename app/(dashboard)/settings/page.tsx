"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-debounce";
import { STORAGE_KEYS, DEFAULT_PAGE_SIZE } from "@/config/constants";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useLocalStorage<"comfortable" | "compact">(
    STORAGE_KEYS.DENSITY,
    "comfortable",
  );
  const [pageSize, setPageSize] = useLocalStorage<number>(
    STORAGE_KEYS.PAGE_SIZE,
    DEFAULT_PAGE_SIZE,
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  function handleSidebarToggle(value: boolean) {
    document.cookie = `sidebar_collapsed=${value}; path=/; max-age=31536000`;
    setSidebarCollapsed(value);
  }

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar_collapsed="));

    if (match) {
      const value = match.split("=")[1];
      setSidebarCollapsed(value === "true");
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label htmlFor="theme-select">Theme</Label>
            <Select value={theme || "system"} onValueChange={setTheme}>
              <SelectTrigger id="theme-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
          <CardDescription>Adjust display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table Density */}
          <div className="space-y-2">
            <Label htmlFor="density-select">Table Density</Label>
            <Select
              value={density}
              onValueChange={(val) =>
                setDensity(val as "comfortable" | "compact")
              }
            >
              <SelectTrigger id="density-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose spacing for table rows
            </p>
          </div>

          {/* Page Size */}
          <div className="space-y-2">
            <Label htmlFor="pagesize-select">Items Per Page</Label>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => setPageSize(Number(val))}
            >
              <SelectTrigger id="pagesize-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 items</SelectItem>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default number of items to show per page
            </p>
          </div>

          {/* Sidebar State */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Collapse Sidebar by Default</Label>
              <p className="text-xs text-muted-foreground">
                Start with sidebar in collapsed state
              </p>
            </div>
            <Switch
              checked={sidebarCollapsed}
              onCheckedChange={handleSidebarToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
