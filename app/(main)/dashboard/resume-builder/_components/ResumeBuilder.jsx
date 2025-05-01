"use client";
import { createResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { buildResumeMarkdown } from "@/lib/markdownConverter";
import MDEditor from "@uiw/react-md-editor";
import { DownloadIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas-pro";
// import html2PDF from "jspdf-html2canvas";
// import html2PDF from "jspdf-html2canvas-pro";

export default function ResumeBuilder({ loggedUser, items }) {
  // console.log("builder");

  const [previewContent, setPreviewContent] = useState(
    buildResumeMarkdown(loggedUser, items)
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: resumeData,
    error: resumeError,
    fn: resumeFn,
    loading: resumeLoading,
  } = useFetch(createResume);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        padding: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      const html2PDF = (await import("jspdf-html2canvas-pro")).default;
      await html2PDF(element, opt);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResume = async () => {
    // console.log("Saving resume...");
    const resumeContent = buildResumeMarkdown(loggedUser, items);
    try {
      const data = {
        name: "Resume_" + uuidv4(),
        content: resumeContent,
      };
      const response = await resumeFn({ ...data });
      if (resumeError) {
        toast.error("Failed to create resume");
      } else {
        toast.success("Successfully saved resume");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("An error occurred while saving the resume.");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <Button
        disabled={resumeLoading}
        onClick={handleSaveResume}
        className={"w-40 ml-auto"}
      >
        {resumeLoading ? "Saving..." : "Save Resume"}
      </Button>
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className={"w-40 ml-auto"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <DownloadIcon className="h-4 w-4" />
            Download PDF
          </>
        )}
      </Button>
      {/* <div className="border rounded-lg hidden">
        <MDEditor
          value={previewContent}
          onChange={setPreviewContent}
          height={800}
          preview={resumeMode}
          data-color-mode="system"
        />
      </div> */}
      <div className="rounded-xl border-2 p-4">
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
