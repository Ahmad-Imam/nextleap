"use client";
import { Button } from "@/components/ui/button";
import { buildResumeMarkdown } from "@/lib/markdownConverter";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";

export default function ResumeBuilder({ loggedUser }) {
  // console.log(loggedUser);

  const [previewContent, setPreviewContent] = useState(
    buildResumeMarkdown(loggedUser)
  );

  const [resumeMode, setResumeMode] = useState("preview");

  return (
    <div className="flex flex-col gap-10">
      <Button
        className={"w-30 ml-auto"}
        onClick={() => {
          setResumeMode((prev) => (prev === "preview" ? "edit" : "preview"));
          // setPreviewContent(getContactMarkdown());
        }}
      >
        {resumeMode === "preview" ? "Edit" : "Preview"}
      </Button>
      <div className="border rounded-lg">
        <MDEditor
          value={previewContent}
          onChange={setPreviewContent}
          height={800}
          preview={resumeMode}
          data-color-mode="system"
        />
      </div>
      <div className="hidden">
        <div id="resume-pdf">
          <MDEditor.Markdown
            source={previewContent}
            style={{
              background: "white",
              color: "black",
            }}
          />
        </div>
      </div>
    </div>
  );
}
