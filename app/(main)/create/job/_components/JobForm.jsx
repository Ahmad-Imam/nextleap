"use client";
import { addJobPost, generateJobPost } from "@/actions/job";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function JobForm() {
  const {
    loading: updateLoadingUrl,
    fn: updateUrlFn,
    data: updateUrlResult,
  } = useFetch(generateJobPost);

  const {
    loading: updateLoadingSubmit,
    fn: updateSubmitFn,
    data: updateSubmitResult,
  } = useFetch(addJobPost);

  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      applicationLink: "",
      jobTitle: "",
      jobDescription: "",
      jobRequirements: [""],
      companyName: "",
      location: "",
      salary: "",
      jobType: "",
      level: "",
      industry: "",
      responsibilities: [""],
    },
  });
  const router = useRouter();

  const handleNext = async () => {
    const url = watch("applicationLink");

    if (url === "") {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      await updateUrlFn({
        url,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onFormSubmit = async (data) => {
    const transformedData = {
      ...data,
      jobRequirements: data.jobRequirements
        ? data.jobRequirements.split("\n").filter((req) => req.trim() !== "")
        : [],

      responsibilities: data.responsibilities
        ? data.responsibilities.split("\n").filter((res) => res.trim() !== "")
        : [],
    };

    await updateSubmitFn(transformedData);
  };

  useEffect(() => {
    if (updateUrlResult) {
      [
        "jobTitle",
        "jobDescription",
        "jobRequirements",
        "companyName",
        "location",
        "salary",
        "jobType",
        "level",
        "industry",
        "responsibilities",
      ].forEach((field) => {
        if (updateUrlResult[field]) {
          setValue(field, updateUrlResult[field]);
        }
      });

      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  }, [updateUrlResult]);

  useEffect(() => {
    if (updateSubmitResult && !updateLoadingSubmit) {
      toast.success("Job post created successfully!");
      router.push("/job/" + updateSubmitResult?.id);
    }
  }, [updateSubmitResult, updateLoadingSubmit]);

  return (
    <Card className="w-full my-10 mx-2 max-w-7xl">
      <CardHeader>
        <CardTitle className="gradient-title text-4xl">
          Create a Job Application
        </CardTitle>
        <CardDescription className={"text-lg"}>
          Autofill using job link or manually enter job details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">
              Step {step} of {totalSteps}
            </span>
            {step > 1 && (
              <Button type="button" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-6 items-center">
              <div className="w-full">
                <Label className="block mb-2 text-md">
                  Do you want to paste a job link?
                </Label>
                <Controller
                  name="applicationLink"
                  control={control}
                  render={({ field }) => (
                    <Input type="url" placeholder="Enter a URL" {...field} />
                  )}
                />
              </div>
              <Button
                type="button"
                className="max-w-sm w-full"
                disabled={updateLoadingUrl}
                onClick={handleNext}
              >
                {updateLoadingUrl ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-2">Job Title</label>
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter job title"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Job Description </label>
                <Controller
                  name="jobDescription"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      className="w-full border rounded p-2"
                      placeholder="Enter job description"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Job Requirements (Atleast 2 separated by new line)
                </label>
                <Controller
                  name="jobRequirements"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      className="w-full border rounded p-2"
                      placeholder="Enter job requirements"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Company Name</label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter company name"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Location</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter location"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Salary</label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter salary range"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Job Type</label>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter job type (e.g., Full-time, Part-time)"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Experience Level</label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter experience level (e.g., Junior, Mid, Senior)"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">Industry</label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter industry"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Responsibilities (Atleast 2 separated by new line)
                </label>
                <Controller
                  name="responsibilities"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      className="w-full border rounded p-2"
                      placeholder="Enter responsibilities"
                      {...field}
                      required
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateLoadingSubmit}
              >
                {updateLoadingSubmit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
