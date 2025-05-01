"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./DashboardNav";

export function DashboardSidebar({ children }) {
  return (
    <SidebarProvider className={""}>
      <div className="flex w-full ">
        <Sidebar
          className="w-64 pt-20"
          collapsible="icon"
          // style={{ position: "static" }}
        >
          <SidebarContent className={"bg-background"}>
            <DashboardNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        {/* Updated SidebarInset classes */}
        <SidebarInset className="flex flex-col flex-1 transition-all duration-300 ease-in-out ">
          {/* Updated main element classes */}
          <header className="p-4">
            <SidebarTrigger />
          </header>
          <main className="min-h-screen p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
