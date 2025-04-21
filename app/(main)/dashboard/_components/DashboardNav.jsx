"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BookmarkIcon,
  BriefcaseIcon,
  FilePlusIcon,
  FileTextIcon,
  FileUserIcon,
  HelpCircleIcon,
  LayoutDashboard,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="py-4 px-2 ">
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
            isActive={pathname === "/dashboard/resume"}
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
            isActive={pathname.startsWith("/dashboard/resume-builder")}
          >
            <Link href="/dashboard/resume-builder">
              <FilePlusIcon className="h-4 w-4" />
              <span>Resume Builder</span>
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

      <SidebarGroup className={"p-0"}>
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
                <Link href="/faq">
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
