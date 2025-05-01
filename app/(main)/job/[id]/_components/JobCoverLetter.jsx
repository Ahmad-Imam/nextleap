"use client";

import { generateCoverLetter } from "@/actions/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobCoverLetter({ jobPost }) {
  const {
    data: coverLetterData,
    loading: isLoadingCoverLetter,
    error: errorCoverLetter,
    fn: generateCoverLetterFn,
  } = useFetch(generateCoverLetter);

  // console.log(coverLetterData);

  const [coverLetter, setCoverLetter] = useState(jobPost?.coverLetter || null);

  useEffect(() => {
    if (coverLetterData && !isLoadingCoverLetter) {
      // console.log(coverLetterData);
      // console.log("New Job Post:", updateSubmitResult);
      //route to the job page
      setCoverLetter(coverLetterData);
      toast.success("Cover letter generated successfully!");
      //   router.push("/job/" + updateSubmitResult?.id);
    }
  }, [coverLetterData, isLoadingCoverLetter]);

  async function handleGenerateCoverLetter() {
    if (!jobPost) {
      toast.error("No job data found!");
      return;
    }
    await generateCoverLetterFn({ ...jobPost });
    if (errorCoverLetter) {
      toast.error("Error generating cover letter: " + errorCoverLetter);
    }
  }

  return (
    <Card className={"mx-4"}>
      <CardHeader className={"flex flex-row justify-center"}>
        <Button
          variant=""
          className="font-semibold text-lg p-6"
          disabled={isLoadingCoverLetter}
          onClick={handleGenerateCoverLetter}
        >
          {isLoadingCoverLetter ? "Generating..." : "Generate Cover Letter"}
        </Button>
      </CardHeader>

      <CardContent className="w-full">
        <h2 className="text-lg font-bold">Generated Cover Letter</h2>
        <p className="my-2 text-md whitespace-pre-wrap">
          {coverLetter || "No cover letter generated yet."}
        </p>
      </CardContent>
    </Card>
  );
}
