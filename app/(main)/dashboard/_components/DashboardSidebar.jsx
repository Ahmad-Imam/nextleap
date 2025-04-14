"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./DashboardNav";

export function DashboardSidebar({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full ">
        <Sidebar
          className="flex-1 fixed left-0 top-0 z-20 h-screen pt-20"
          collapsible="icon"
        >
          {/* <SidebarHeader className="flex h-14 ">
            <SidebarTrigger />
          </SidebarHeader> */}
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        {/* Updated SidebarInset classes */}
        <SidebarInset className="w-2/3 transition-all duration-300 ease-in-out ">
          <header className="sticky top-0 z-10 flex h-14 items-center bg-background px-4">
            <SidebarTrigger />
            <h2 className="ml-2 text-lg font-semibold"></h2>
          </header>
          {/* Updated main element classes */}
          <main className="p-4 w-full max-w-full ">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
