"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useFetch from "@/hooks/useFetch";
import { addJobPost, generateJobPost } from "@/actions/job";

const TestTimeout = async () => {
  console.log("TestTimeout called");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 2000); // 2 seconds delay
  });
};

export default function JobForm() {
  const {
    loading: updateLoadingUrl,
    fn: updateUrlFn,
    data: updateUrlResult,
  } = useFetch(generateJobPost);
  // console.log(generateJobPost);

  const {
    loading: updateLoadingSubmit,
    fn: updateSubmitFn,
    data: updateSubmitResult,
  } = useFetch(addJobPost);

  const [step, setStep] = useState(1);
  const totalSteps = 2; // Total number of steps in the form
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      applicationLink: "",
      generateCoverLetter: false,
      jobTitle: "",
      jobDescription: "",
      jobRequirements: "",
      companyName: "",
      location: "",
      salary: "",
      jobType: "",
      level: "",
      industry: "",
      responsibilities: "",
    },
  });
  const router = useRouter();
  const generateCoverLetter = watch("generateCoverLetter");

  const handleNext = async () => {
    // get the url value
    const url = watch("applicationLink");
    console.log("URL:", url);

    if (url === "") {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      await updateUrlFn({
        // ...values,
        url,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); // Move to the previous step
    }
  };

  const onFormSubmit = async (data) => {
    console.log("Form Data:", data);
    const { generateCoverLetter, ...updatedData } = data;

    await updateSubmitFn(updatedData);
    console.log("New Job Post:", updateSubmitResult);
    //route to the job page
    toast.success("Job post created successfully!");
    router.push("/job/" + updateSubmitResult.id);
  };

  useEffect(() => {
    if (updateUrlResult) {
      console.log("updateResult:", updateUrlResult);

      // Set the job title, description, and requirements in the form
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

      // Move to the next step
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  }, [updateUrlResult]);

  return (
    <div className="flex items-center justify-center bg-background w-2xl py-20">
      <Card className="w-full max-w-3xl md:max-w-4xl my-10 mx-2">
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
              <>
                <div>
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
                <div>
                  <Controller
                    name="generateCoverLetter"
                    control={control}
                    render={({ field }) => (
                      <Label className="flex items-center space-x-2 text-md">
                        <Checkbox
                          checked={field.value} // Bind the checked state to the field value
                          onCheckedChange={(checked) => field.onChange(checked)} // Update the field value on change
                        />
                        <span>Do you want to generate a cover letter?</span>
                      </Label>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full"
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
              </>
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
                  <label className="block mb-2">Job Description</label>
                  <Controller
                    name="jobDescription"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className="w-full border rounded p-2"
                        placeholder="Enter job description"
                        {...field}
                        required
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block mb-2">Job Requirements</label>
                  <Controller
                    name="jobRequirements"
                    control={control}
                    render={({ field }) => (
                      <textarea
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
                  <label className="block mb-2">Responsibilities</label>
                  <Controller
                    name="responsibilities"
                    control={control}
                    render={({ field }) => (
                      <textarea
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
    </div>
  );
}
