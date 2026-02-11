'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useLocalStorage } from '@/hooks/use-debounce';
import { STORAGE_KEYS, DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [density, setDensity] = useLocalStorage<'comfortable' | 'compact'>(
    STORAGE_KEYS.DENSITY,
    'comfortable'
  );
  const [pageSize, setPageSize] = useLocalStorage<number>(
    STORAGE_KEYS.PAGE_SIZE,
    DEFAULT_PAGE_SIZE
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>(
    STORAGE_KEYS.SIDEBAR_COLLAPSED,
    false
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout title="Settings">
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
              <Select value={theme || 'system'} onValueChange={setTheme}>
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
              <Select value={density} onValueChange={(val) => setDensity(val as 'comfortable' | 'compact')}>
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
              <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
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
                onCheckedChange={setSidebarCollapsed}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Product Management Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This is a professional product management dashboard for e-commerce platforms.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React 19</Badge>
                <Badge variant="secondary">Next.js 16</Badge>
                <Badge variant="secondary">TanStack Query</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </div>
            </div>

            {/* API Status */}
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium">API Configuration</p>
              <p className="mt-1 text-xs text-muted-foreground">
                API Base URL: <span className="font-mono">https://dummyjson.com</span>
              </p>
            </div>

            {/* Help Text */}
            <div className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">Test Credentials</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                Username: emilys
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Password: emilyspass
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Development Info */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Architecture information</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">State Management:</span> Zustand
                (Auth) + React Query (Server State)
              </li>
              <li>
                <span className="font-medium text-foreground">Forms:</span> React Hook Form +
                Zod
              </li>
              <li>
                <span className="font-medium text-foreground">UI Components:</span> ShadCN UI
              </li>
              <li>
                <span className="font-medium text-foreground">Styling:</span> Tailwind CSS
              </li>
              <li>
                <span className="font-medium text-foreground">Token Refresh:</span> Automatic
                with Axios interceptors
              </li>
              <li>
                <span className="font-medium text-foreground">File Upload:</span> Cloudinary
                unsigned uploads
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
