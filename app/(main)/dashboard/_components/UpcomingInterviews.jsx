"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

export function UpcomingInterviews({ upcomingInterviews }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>
            Your scheduled interviews for the next 15 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingInterviews.map((interview, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-4 p-3 rounded-lg border flex-wrap shadow-xs hover:shadow-md transition duration-200 ease-in-out"
              >
                <div className="">
                  <p className="text-sm font-medium">{interview.jobTitle}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {interview.companyName}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(interview.date)}</span>
                  </div>
                </div>
                <div>
                  <Link href={`/job/${interview.id}`}>
                    <Button variant="" size="">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {upcomingInterviews.length === 0 && (
              <div className="text-sm font-semibold text-center">
                No upcoming interviews scheduled.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
