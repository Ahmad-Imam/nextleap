import { DashboardSidebar } from "./_components/DashboardSidebar";

export default async function DashboardShellLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar>{children}</DashboardSidebar>
    </div>
  );
}
