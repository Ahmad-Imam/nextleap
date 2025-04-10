"use client";
import React, { useState } from "react";
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
import { generateJobPost } from "@/actions/job";

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
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(generateJobPost);
  // console.log(generateJobPost);

  const [step, setStep] = useState(1);
  const totalSteps = 2; // Total number of steps in the form
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      url: "",
      generateCoverLetter: false,
      jobTitle: "",
      jobDescription: "",
      jobRequirements: "",
    },
  });
  const router = useRouter();
  const generateCoverLetter = watch("generateCoverLetter");

  const handleNext = async () => {
    // get the url value
    const url = watch("url");
    console.log("URL:", url);

    const response = await updateUserFn({
      // ...values,
      url,
    });

    console.log("updateResult", updateResult);
    console.log(updateResult?.jobTitle);
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); // Move to the previous step
    }
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="flex items-center justify-center bg-background w-2xl">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    name="url"
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
                  disabled={updateLoading}
                  onClick={handleNext}
                >
                  {updateLoading ? (
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

                <Button type="submit">Submit</Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
