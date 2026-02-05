"use client";

import { updateJobPost } from "@/actions/job";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditJobForm({ jobPost }) {
  const router = useRouter();

  const {
    loading: isUpdating,
    fn: updateJobFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateJobPost);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      applicationLink: jobPost?.applicationLink || "",
      jobTitle: jobPost?.jobTitle || "",
      jobDescription: jobPost?.jobDescription || "",
      jobRequirements: Array.isArray(jobPost?.jobRequirements)
        ? jobPost.jobRequirements.join("\n")
        : "",
      companyName: jobPost?.companyName || "",
      location: jobPost?.location || "",
      salary: jobPost?.salary || "",
      jobType: jobPost?.jobType || "",
      level: jobPost?.level || "",
      industry: jobPost?.industry || "",
      notes: jobPost?.notes || "",
      responsibilities: Array.isArray(jobPost?.responsibilities)
        ? jobPost.responsibilities.join("\n")
        : "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      jobRequirements: data.jobRequirements
        ? data.jobRequirements
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      responsibilities: data.responsibilities
        ? data.responsibilities
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    };

    await updateJobFn(jobPost.id, payload);
  };

  useEffect(() => {
    if (updateResult && !isUpdating) {
      toast.success("Job updated successfully!");
      router.push(`/job/${jobPost.id}`);
      router.refresh();
    }
  }, [updateResult, isUpdating, router, jobPost.id]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update job.");
    }
  }, [updateError]);

  return (
    <Card className="w-full my-10 mx-2 max-w-7xl">
      <CardHeader>
        <CardTitle className="text-4xl">Edit Job Application</CardTitle>
        <CardDescription className="text-lg">
          Update the tracked details for this job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="block mb-2">Application Link</Label>
            <Controller
              name="applicationLink"
              control={control}
              render={({ field }) => (
                <Input type="url" placeholder="Enter application URL" {...field} />
              )}
            />
          </div>

          <div>
            <Label className="block mb-2">Job Title</Label>
            <Controller
              name="jobTitle"
              control={control}
              render={({ field }) => <Input type="text" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">Job Description</Label>
            <Controller
              name="jobDescription"
              control={control}
              render={({ field }) => <Textarea className="w-full p-2" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">
              Job Requirements (one per line)
            </Label>
            <Controller
              name="jobRequirements"
              control={control}
              render={({ field }) => <Textarea className="w-full p-2" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">Company Name</Label>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => <Input type="text" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => <Input type="text" {...field} />}
            />
          </div>

          <div>
            <Label className="block mb-2">Salary</Label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => <Input type="text" {...field} />}
            />
          </div>

          <div>
            <Label className="block mb-2">Job Type</Label>
            <Controller
              name="jobType"
              control={control}
              render={({ field }) => <Input type="text" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">Experience Level</Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => <Input type="text" {...field} />}
            />
          </div>

          <div>
            <Label className="block mb-2">Industry</Label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => <Input type="text" {...field} required />}
            />
          </div>

          <div>
            <Label className="block mb-2">Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  className="w-full p-2"
                  placeholder="Any personal notes about this job"
                  {...field}
                />
              )}
            />
          </div>

          <div>
            <Label className="block mb-2">
              Responsibilities (one per line)
            </Label>
            <Controller
              name="responsibilities"
              control={control}
              render={({ field }) => <Textarea className="w-full p-2" {...field} required />}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={`/job/${jobPost.id}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
