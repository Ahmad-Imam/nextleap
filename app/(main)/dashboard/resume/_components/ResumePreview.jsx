"use client";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { DownloadIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas-pro";
// import html2PDF from "jspdf-html2canvas";
// import html2PDF from "jspdf-html2canvas-pro";

export default function ResumePreview({ previewContent }) {
  console.log("builder");

  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="flex flex-col gap-10 w-full flex-1">
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
