import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BanknoteIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import JobActions from "./JobActions";
import JobBookmark from "./JobBookmark";
import JobNotes from "./JobNotes";
import { ApplicationTimeline } from "./JobTimeline";

export default function JobDetails({ jobPost }) {
  const {
    jobTitle = "",
    jobDescription = "",
    companyName = "",
    location = "",
    salary = "",
    jobType = "",
    industry = "",
    level = "",
    notes = "",
    jobRequirements = [],
    responsibilities = [],
    applicationLink = "",
    timeline = [],
    isBookmark = false,
    id: jobId = null,
  } = jobPost || {};

  return (
    <Card className="w-full shadow-lg pt-0">
      <CardHeader className="rounded-t-lg bg-accent-foreground/20 p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl break-words">
                {jobTitle}
              </h1>
              <div className="mt-2 flex flex-col gap-2 text-base text-accent-foreground sm:text-lg">
                <div className="flex min-w-0 items-center">
                  <BuildingIcon className="mr-2 h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                  <span className="truncate font-bold">{companyName}</span>
                </div>
                <div className="flex min-w-0 items-center">
                  <MapPinIcon className="mr-2 h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
              <Badge variant="" className="font-medium text-sm sm:text-base">
                {level ? level : "N/A"} Level
              </Badge>
              <Badge variant="" className="font-medium text-sm sm:text-base">
                {industry ? industry : "N/A"} Industry
              </Badge>
              <JobBookmark jobId={jobId} isBookmark={isBookmark} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center rounded-md bg-card px-3 py-1.5">
              <BriefcaseIcon className="mr-2 h-5 w-5 text-accent-foreground sm:h-6 sm:w-6" />
              <span className="text-sm font-medium text-accent-foreground sm:text-base">
                {jobType && jobType.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center rounded-md bg-card px-3 py-1.5">
              <BanknoteIcon className="mr-2 h-5 w-5 text-accent-foreground sm:h-6 sm:w-6" />
              <span className="text-sm font-medium text-accent-foreground sm:text-base">
                {salary ? salary : "Salary N/A"}
              </span>
            </div>
            {applicationLink && applicationLink != "" && (
              <Link href={applicationLink} target="_blank" className="w-full sm:w-auto">
                <Badge variant="" className="w-full justify-center font-medium text-sm sm:text-base">
                  Go To Website
                </Badge>
              </Link>
            )}
            <JobActions jobId={jobId} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Job Details */}
          <div className="space-y-6 lg:w-2/3">
            <div>
              <h2 className="text-lg font-semibold mb-3">Job Description</h2>
              <p className="text-accent-foreground">{jobDescription}</p>
            </div>

            {/* <Separator />

            <JobNotes jobId={jobId} initialNotes={notes} />

            <Separator /> */}

            <div>
              <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1 text-accent-foreground">
                {responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-accent-foreground">
                {jobRequirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline Component */}
          <div className="flex flex-col justify-around gap-8 border-t pt-6 lg:w-1/3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg font-semibold mb-4">Application Status</h2>
              <ApplicationTimeline timeline={timeline} jobId={jobId} />
            </div>
            <JobNotes jobId={jobId} initialNotes={notes} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
