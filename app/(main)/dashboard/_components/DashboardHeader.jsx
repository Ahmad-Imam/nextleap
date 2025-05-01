import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BookmarkIcon,
  BriefcaseIcon,
  FileIcon,
  MailIcon,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";

export function DashboardHeader({
  createdJobsCount,
  appliedJobsCount,
  bookmarkedJobsCount,
  resumesCount,
}) {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 lg:gap-10">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">
            Manage your job postings, applications, and saved jobs.
          </p>
        </div>
        <Link className="flex items-center gap-2" href={"/create/job"}>
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Track New Job
          </Button>
        </Link>
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
            <div className="text-2xl font-bold">{createdJobsCount}</div>
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
            <div className="text-2xl font-bold">{appliedJobsCount}</div>
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
            <div className="text-2xl font-bold">{bookmarkedJobsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md lg:text-lg xl:text-xl font-lg">
              Resumes
            </CardTitle>
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumesCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
