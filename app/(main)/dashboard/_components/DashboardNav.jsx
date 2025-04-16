"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseIcon,
  BookmarkIcon,
  FileTextIcon,
  CalendarIcon,
  MessageSquareIcon,
  SettingsIcon,
  HelpCircleIcon,
  FileUserIcon,
  UserIcon,
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
  const pathname = usePathname();

  return (
    <div className="py-4 pl-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/jobs")}
          >
            <Link href="/dashboard/jobs">
              <BriefcaseIcon className="h-4 w-4" />
              <span>My Jobs</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/bookmarks")}
          >
            <Link href="/dashboard/bookmarks">
              <BookmarkIcon className="h-4 w-4" />
              <span>Bookmarks</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/applications")}
          >
            <Link href="/dashboard/applications">
              <FileTextIcon className="h-4 w-4" />
              <span>Applications</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/resume")}
          >
            <Link href="/dashboard/resume">
              <FileUserIcon className="h-4 w-4" />
              <span>Resume</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/messages")}
          >
            <Link href="/dashboard/messages">
              <MessageSquareIcon className="h-4 w-4" />
              <span>Messages</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator className="my-4" />

      <SidebarGroup>
        <SidebarGroupLabel>
          <SettingsIcon className="h-4 w-4" />
          <span className="pl-2">Settings</span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/profile")}
              >
                <Link href="/dashboard/profile">
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/help")}
              >
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
