"use client";

import { Suspense } from "react";

import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import DarkModeToggle from "./dark-mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import SearchBar from "./searchbar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const showSearchRoutes = ["/products", "/users"];

export function Header() {
  const pathname = usePathname();

  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/products/new": "Add Product", // static route first
    "/products/[id]": "Product Details", // dynamic route last
  };

  function getTitle(path: string) {
    if (path === "/") return "Dashboard";

    // Check static routes first
    if (routeTitles[path]) return routeTitles[path];

    // Check dynamic routes
    for (const pattern in routeTitles) {
      if (
        pattern.includes("[") &&
        new RegExp(`^${pattern.replace(/\[.*?\]/g, "[^/]+")}$`).test(path)
      ) {
        return routeTitles[pattern];
      }
    }

    // fallback: last segment
    return path.split("/").filter(Boolean).slice(-1)[0];
  }

  const title = getTitle(pathname);

  const showSearch = showSearchRoutes.includes(pathname);

  const { user, logout } = useAuth();

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 my-auto" />

      {/* Title and Search */}
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground capitalize">
          {title}
        </h1>
        {showSearch && (
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchBar />
          </Suspense>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <DarkModeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || "/placeholder.svg"}
                  alt={user?.username}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full max-w-60">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
