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

  const [coverLetter, setCoverLetter] = useState(jobPost?.coverLetter || null);

  useEffect(() => {
    if (coverLetterData && !isLoadingCoverLetter) {
      setCoverLetter(coverLetterData);
      toast.success("Cover letter generated successfully!");
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
    <Card>
      <CardHeader className="flex flex-row justify-center px-4 sm:px-6">
        <Button
          variant=""
          className="w-full max-w-md p-5 text-base font-semibold sm:text-lg"
          disabled={isLoadingCoverLetter}
          onClick={handleGenerateCoverLetter}
        >
          {isLoadingCoverLetter ? "Generating..." : "Generate Cover Letter"}
        </Button>
      </CardHeader>

      <CardContent className="w-full px-4 sm:px-6">
        <h2 className="text-lg font-bold">Generated Cover Letter</h2>
        <p className="my-2 text-md whitespace-pre-wrap">
          {coverLetter || "No cover letter generated yet."}
        </p>
      </CardContent>
    </Card>
  );
}
