import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  BanknoteIcon,
} from "lucide-react";
import { ApplicationTimeline } from "./JobTimeline";

export default function JobDetails({ jobPosting }) {
  return (
    <Card className="shadow-lg mx-4 pt-0">
      <CardHeader className="bg-accent rounded-t-lg p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {jobPosting.jobTitle}
              </h1>
              <div className="flex items-center mt-2 text-accent-foreground">
                <BuildingIcon className="h-4 w-4 mr-1" />
                <span className="mr-4">{jobPosting.companyName}</span>
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{jobPosting.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-800 font-medium"
              >
                {jobPosting.level} Level
              </Badge>
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-800 font-medium"
              >
                {jobPosting.industry}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-accent-foreground" />
              <span className="text-sm font-medium">{jobPosting.jobType}</span>
            </div>
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md">
              <BanknoteIcon className="h-4 w-4 mr-2 text-accent-foreground" />
              <span className="text-sm font-medium">{jobPosting.salary}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Job Details */}
          <div className="md:w-2/3 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Job Description</h2>
              <p className="text-accent-foreground">
                {jobPosting.jobDescription}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1 text-accent-foreground">
                {jobPosting.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-accent-foreground">
                {jobPosting.jobRequirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline Component */}
          <div className="md:w-1/3 border-l pl-6">
            <h2 className="text-lg font-semibold mb-4">Application Status</h2>
            <ApplicationTimeline />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
