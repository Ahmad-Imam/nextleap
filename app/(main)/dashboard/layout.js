import { DashboardSidebar } from "./_components/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardShellLayout({ children }) {
  return (
    <div className="">
      <DashboardSidebar>{children}</DashboardSidebar>
    </div>
  );
}
