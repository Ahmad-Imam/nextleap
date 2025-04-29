"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./DashboardNav";

export function DashboardSidebar({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full ">
        <Sidebar
          className="w-64 h-screen "
          collapsible="icon"
          style={{ position: "static" }}
        >
          <SidebarHeader className="flex h-14 ">
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent className={"bg-background"}>
            <DashboardNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        {/* Updated SidebarInset classes */}
        <SidebarInset className="flex flex-col flex-1 transition-all duration-300 ease-in-out ">
          {/* Updated main element classes */}
          <main className="min-h-screen p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
