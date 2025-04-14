"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BriefcaseIcon,
  BookmarkIcon,
  FileTextIcon,
  CalendarIcon,
  MessageSquareIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function DashboardNav() {
  return (
    <div className="py-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/jobs">
              <BriefcaseIcon className="h-4 w-4" />
              <span>My Jobs</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/bookmarks">
              <BookmarkIcon className="h-4 w-4" />
              <span>Bookmarks</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/applications">
              <FileTextIcon className="h-4 w-4" />
              <span>Applications</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/interviews">
              <CalendarIcon className="h-4 w-4" />
              <span>Interviews</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/messages">
              <MessageSquareIcon className="h-4 w-4" />
              <span>Messages</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator className="my-4" />

      <SidebarGroup>
        <SidebarGroupLabel>Support</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/settings">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/help">
                  <HelpCircleIcon className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
