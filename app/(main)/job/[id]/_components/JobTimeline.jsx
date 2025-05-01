"use client";

import { addTimelinePoint } from "@/actions/job";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDaysIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ApplicationTimeline({ timeline, jobId }) {
  const [timelinePoints, setTimelinePoints] = useState(timeline ?? []);
  const [interviewDate, setInterviewDate] = useState(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [status, setStatus] = useState("");

  const isApplied = timelinePoints.some((point) => point.type === "applied");
  const isFinalized = timelinePoints.some(
    (point) => point.type === "selected" || point.type === "rejected"
  );
  const interviewCount = timelinePoints.filter(
    (point) => point.type === "interview"
  ).length;

  const router = useRouter();

  const {
    data: jobPost,
    error: jobPostError,
    loading: jobPostLoading,
    fn: updateJobPostTimeline,
  } = useFetch(addTimelinePoint);

  const handleApply = async () => {
    if (isApplied) return;

    const newTimelinePoint = {
      id: "applied",
      type: "applied",
      date: new Date(),
      position: "left",
    };

    await updateJobPostTimeline(jobId, newTimelinePoint);
    setStatus("applied");
    if (jobPostError) {
      console.error("Error updating job post timeline:", jobPostError);
      toast.error("Failed to update job post timeline.");
      return;
    }
  };

  const handleAddInterview = async () => {
    if (!interviewDate || isFinalized) return;

    const newTimelinePoint = {
      id: `interview-${interviewCount + 1}`,
      type: "interview",
      date: interviewDate,
      position: timelinePoints.length % 2 === 0 ? "left" : "right",
    };

    await updateJobPostTimeline(jobId, newTimelinePoint);
    setStatus("interview");
    if (jobPostError) {
      console.error("Error updating job post timeline:", jobPostError);
      toast.error("Failed to update job post timeline.");
      return;
    }
  };

  const handleSetStatus = async (status) => {
    if (isFinalized) return;

    const newTimelinePoint = {
      id: status,
      type: status,
      date: new Date(),
      position: timelinePoints.length % 2 === 0 ? "left" : "right",
    };
    setStatus(status);
    await updateJobPostTimeline(jobId, newTimelinePoint);

    if (jobPostError) {
      console.error("Error updating job post timeline:", jobPostError);
      toast.error("Failed to update job post timeline.");
      return;
    }
  };

  const getTimelinePointIcon = (type) => {
    switch (type) {
      case "applied":
        return <CheckCircle2Icon className="h-6 w-6 text-blue-500" />;
      case "interview":
        return <CalendarDaysIcon className="h-6 w-6 text-amber-500" />;
      case "selected":
        return <CheckCircle2Icon className="h-6 w-6 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
    }
  };

  const getTimelinePointLabel = (type, id) => {
    switch (type) {
      case "applied":
        return "Applied";
      case "interview":
        const interviewNumber = id.split("-")[1];
        return `Interview ${interviewNumber}`;
      case "selected":
        return "Selected";
      case "rejected":
        return "Rejected";
    }
  };

  useEffect(() => {
    if (jobPost && !jobPostLoading) {
      const newTimelinePoint =
        status === "interview"
          ? {
              id: `interview-${interviewCount + 1}`,
              type: "interview",
              date: interviewDate,
              position: timelinePoints.length % 2 === 0 ? "left" : "right",
            }
          : status === "selected" || status === "rejected"
          ? {
              id: status,
              type: status,
              date: new Date(),
              position: timelinePoints.length % 2 === 0 ? "left" : "right",
            }
          : {
              id: "applied",
              type: "applied",
              date: new Date(),
              position: "left",
            };

      // : !isFinalized
      // ? {
      //     id: "applied",
      //     type: "applied",
      //     date: new Date(),
      //     position: "left",
      //   }
      // : {
      //     id: status,
      //     type: status,
      //     date: new Date(),
      //     position: timelinePoints.length % 2 === 0 ? "left" : "right",
      //   };

      // router.push("/");
      setTimelinePoints((prev) => [...prev, newTimelinePoint]);
      setInterviewDate(undefined);
      setCalendarOpen(false);
      toast.success("Job updated successfully!");
      router.refresh();
    }
  }, [jobPost, jobPostLoading]);
  // console.log("timelinePoints", timelinePoints);

  return (
    <div className="flex flex-col w-full items-center ">
      {/* Timeline */}
      <div className="relative flex flex-col items-center ">
        {/* Vertical line */}
        {timelinePoints.length > 0 && (
          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400" />
        )}

        {/* Timeline points */}
        <div className="relative space-y-10 pb-4  w-full">
          {timelinePoints.map((point) => (
            <div
              key={point.id}
              className={cn(
                "flex justify-start items-center  ",
                point.position === "left"
                  ? "flex-row-reverse pl-8"
                  : "flex-row pr-8"
              )}
            >
              <div className="flex-1 px-4 w-[180px] ">
                <div
                  className={cn(
                    "text-sm font-medium",
                    point.position === "left" ? "text-left" : "text-right"
                  )}
                >
                  {getTimelinePointLabel(point.type, point.id)}
                </div>
                <div
                  className={cn(
                    "text-xs text-slate-500",
                    point.position === "left" ? "text-left" : "text-right"
                  )}
                >
                  {format(point?.date, "MMM d, yyyy")}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent border-2 border-slate-200">
                {getTimelinePointIcon(point.type)}
              </div>

              <div className="flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3 w-full flex flex-col items-center">
        {!isApplied ? (
          <Button
            onClick={handleApply}
            className="w-full max-w-[200px] font-semibold"
            variant="default"
            disabled={jobPostLoading}
          >
            {jobPostLoading ? "Applying..." : "Apply"}
          </Button>
        ) : !isFinalized ? (
          <div className="flex flex-col items-center">
            <DatePicker date={interviewDate} setDate={setInterviewDate} />
            <div className="p-3 border-t border-border">
              <Button
                onClick={handleAddInterview}
                disabled={!interviewDate || jobPostLoading}
                className="w-full font-semibold"
              >
                {jobPostLoading ? "Adding..." : "Confirm Interview"}
              </Button>
            </div>

            <div className="flex gap-6 pt-6">
              <Button
                onClick={() => handleSetStatus("selected")}
                variant="outline"
                className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-700 font-semibold xl:text-lg p-4"
              >
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                {jobPostLoading ? "Finalizing..." : "Selected"}
              </Button>
              <Button
                onClick={() => handleSetStatus("rejected")}
                variant="outline"
                className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold xl:text-lg p-4"
              >
                <XCircleIcon className="mr-2 h-4 w-4" />
                {jobPostLoading ? "Finalizing..." : "Rejected"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-slate-500">
            Application process completed
          </div>
        )}
      </div>
    </div>
  );
}
