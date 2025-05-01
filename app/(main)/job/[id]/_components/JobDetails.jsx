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
import JobBookmark from "./JobBookmark";
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
    jobRequirements = [],
    responsibilities = [],
    applicationLink = "",
    timeline = [],
    isBookmark = false,
    id: jobId = null,
  } = jobPost || {};

  return (
    <Card className="shadow-lg mx-4 pt-0">
      <CardHeader className="bg-accent-foreground/20 rounded-t-lg p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{jobTitle}</h1>
              <div className="flex items-center mt-2 text-accent-foreground text-xl">
                <BuildingIcon className="h-6 w-6 mr-1" />
                <span className="mr-4 font-bold">{companyName}</span>
                <MapPinIcon className="h-6 w-6 mr-1" />
                <span>{location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="" className=" font-medium text-lg">
                {level ? level : "N/A"} Level
              </Badge>
              <Badge variant="" className=" font-medium text-lg">
                {industry ? industry : "N/A"} Industry
              </Badge>
              <JobBookmark jobId={jobId} isBookmark={isBookmark} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex items-center  px-3 py-1.5 rounded-md bg-card">
              <BriefcaseIcon className="h-6 w-6 mr-2 text-accent-foreground" />
              <span className="text-lg font-medium text-accent-foreground">
                {jobType && jobType.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center  px-3 py-1.5 rounded-md bg-card">
              <BanknoteIcon className="h-6 w-6 mr-2 text-accent-foreground" />
              <span className="text-lg font-medium text-accent-foreground">
                {salary ? salary : "Salary N/A"}
              </span>
            </div>
            {applicationLink && applicationLink != "" && (
              <Link href={applicationLink} target="_blank">
                <Badge variant="" className=" font-medium text-lg">
                  Go To Website
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Job Details */}
          <div className="md:w-2/3 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Job Description</h2>
              <p className="text-accent-foreground">{jobDescription}</p>
            </div>

            <Separator />

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
          <div className="md:w-1/3 border-l pl-6 flex flex-col justify-start items-center ">
            <h2 className="text-lg font-semibold mb-4">Application Status</h2>
            <ApplicationTimeline timeline={timeline} jobId={jobId} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
