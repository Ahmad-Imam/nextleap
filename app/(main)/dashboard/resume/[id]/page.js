import React from "react";
import ResumePreview from "../_components/ResumePreview";
import { getResumeById } from "@/actions/resume";
import ResumeName from "../_components/ResumeName";

export default async function ResumePreviewPage({ params }) {
  const { id } = await params;

  const resume = await getResumeById(id);
  if (!resume) {
    return <div className="p-4">Resume not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Preview</h1>
      <ResumeName id={resume.id} name={resume.name} />
      <div className="flex flex-col gap-10">
        <ResumePreview previewContent={resume?.content} />
      </div>
    </div>
  );
}
