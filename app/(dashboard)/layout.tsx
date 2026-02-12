import { DashboardContainer } from "@/components/layout/dashboard-container";
import { cookies } from "next/headers";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();

  const sidebarCollapsed =
    cookieStore.get("sidebar_collapsed")?.value === "true";

  return (
    <DashboardContainer sidebarOpen={!sidebarCollapsed}>
      {children}
    </DashboardContainer>
  );
}

export default DashboardLayout;
