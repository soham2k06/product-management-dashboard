import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Package, Settings, Users } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarContent>
        <div className="flex items-center border-b gap-2 h-16 px-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary group-data-[collapsible=icon]:size-4 transition-all">
            <Package className="size-5 text-primary-foreground group-data-[collapsible=icon]:size-4 transition-all" />
          </div>
          <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:opacity-0 transition-opacity">
            Dashboard
          </span>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton tooltip={item.name} asChild>
                  <Link href={item.href}>
                    <item.icon className="me-2" size={18} />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
