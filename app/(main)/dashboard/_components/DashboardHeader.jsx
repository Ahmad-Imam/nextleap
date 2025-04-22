import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BookmarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  MailIcon,
  PlusCircleIcon,
} from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 lg:gap-10">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">
            Manage your job postings, applications, and saved jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Track New Job
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:gap-6 lg:gap-10 md:grid-cols-2 xl:grid-cols-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md lg:text-xl font-lg">
              Created Jobs
            </CardTitle>
            <BriefcaseIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            {/* <p className="text-xs md:text-md lg:text-lg font-lg">
              +2 from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md lg:text-lg xl:text-xl font-lg">
              Applied
            </CardTitle>
            <MailIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md lg:text-lg xl:text-xl font-lg">
              Interviews
            </CardTitle>
            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md lg:text-lg xl:text-xl font-lg">
              Bookmarked
            </CardTitle>
            <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
