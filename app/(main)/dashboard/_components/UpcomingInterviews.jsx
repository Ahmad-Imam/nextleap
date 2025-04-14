"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, VideoIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpcomingInterviews() {
  const interviews = [
    {
      id: 1,
      candidate: "Alex Johnson",
      position: "Frontend Developer",
      date: "Today, 2:00 PM",
      type: "video",
      avatar: "/placeholder.svg",
      initials: "AJ",
    },
    {
      id: 2,
      candidate: "Maria Garcia",
      position: "UX Designer",
      date: "Tomorrow, 10:30 AM",
      type: "in-person",
      avatar: "/placeholder.svg",
      initials: "MG",
    },
    {
      id: 3,
      candidate: "David Kim",
      position: "DevOps Engineer",
      date: "May 15, 3:15 PM",
      type: "video",
      avatar: "/placeholder.svg",
      initials: "DK",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>
            Your scheduled interviews for the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{interview.candidate}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {interview.position}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{interview.date}</span>
                  </div>
                </div>
                <div>
                  {interview.type === "video" ? (
                    <Button size="sm" variant="outline" className="h-8">
                      <VideoIcon className="h-3.5 w-3.5 mr-1" />
                      Join
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                      Directions
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div>interview</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
