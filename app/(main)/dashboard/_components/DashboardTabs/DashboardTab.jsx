import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "../JobCard";
import {
  CalendarIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  MailIcon,
  CheckCircleIcon,
  Grid2X2Icon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function DashboardTab({
  allJobPosts,
  bookmarkedJobPosts,
  applicationJobPosts,
}) {
  return (
    <Tabs defaultValue="createdAt" className="space-y-4 w-full">
      <TabsList className={"w-full flex"}>
        <TabsTrigger value="createdAt">Created Jobs</TabsTrigger>
        <TabsTrigger value="bookmarked">Bookmarked Jobs</TabsTrigger>
        <TabsTrigger value="applications">My Applications</TabsTrigger>
      </TabsList>

      <TabsContent value="createdAt" className="space-y-4 w-full ">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allJobPosts.slice(0, 5).map((jobPost) => (
            <JobCard
              key={jobPost.id}
              jobTitle={jobPost?.jobTitle}
              companyName={jobPost?.companyName}
              location={jobPost?.location}
              salary={jobPost?.salary}
              applicants={jobPost?.applicants}
              createdAt={jobPost?.createdAt}
              status={jobPost?.status}
              id={jobPost.id}
            />
          ))}

          {allJobPosts.length === 0 ? (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Jobs Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No jobs found. Create a new job to get started.
                </p>
                <Link href="/create/job" className="w-full">
                  <Button>Create Job</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">View all Jobs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View all tracked jobs
                </p>
                <Link href="/dashboard/jobs" className="w-full">
                  <Button>View All</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="bookmarked" className="space-y-4 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarkedJobPosts.slice(0, 5).map((jobPost) => (
            <JobCard
              key={jobPost.id}
              jobTitle={jobPost?.jobTitle}
              companyName={jobPost?.companyName}
              location={jobPost?.location}
              salary={jobPost?.salary}
              applicants={jobPost?.applicants}
              createdAt={jobPost?.createdAt}
              status={jobPost?.status}
              id={jobPost.id}
            />
          ))}

          {bookmarkedJobPosts.length === 0 ? (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Jobs Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No jobs bookmarked. Bookmark a job to get started.
                </p>
                {/* <Link href="/create/job" className="w-full">
                  <Button>Create Job</Button>
                </Link> */}
              </div>
            </Card>
          ) : (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">View all Jobs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View all tracked jobs
                </p>
                <Link href="/dashboard/bookmarks" className="w-full">
                  <Button>View All</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="applications" className="space-y-4 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applicationJobPosts.slice(0, 5).map((jobPost) => (
            <JobCard
              key={jobPost.id}
              jobTitle={jobPost?.jobTitle}
              companyName={jobPost?.companyName}
              location={jobPost?.location}
              salary={jobPost?.salary}
              applicants={jobPost?.applicants}
              createdAt={jobPost?.createdAt}
              status={jobPost?.status}
              id={jobPost.id}
            />
          ))}

          {applicationJobPosts.length === 0 ? (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Jobs Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No jobs applied. Apply for a job to get started.
                </p>
                {/* <Link href="/create/job" className="w-full">
                  <Button>Create Job</Button>
                </Link> */}
              </div>
            </Card>
          ) : (
            <Card className="flex h-full items-center justify-center p-8 border-dashed shadow-none">
              <div className="flex flex-col items-center text-center">
                <Grid2X2Icon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">View all Jobs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View all tracked jobs
                </p>
                <Link href="/dashboard/applications" className="w-full">
                  <Button>View All</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
