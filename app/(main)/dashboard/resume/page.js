import React from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from "./_components/ResumeForm";
import ResumeBuilder from "./_components/ResumeBuilder";
import { getUser } from "@/actions/user";
import ResumeOrder from "./_components/ResumeOrder";
import ResumeTabClient from "./_components/ResumeTabClient";

export default async function ResumePage() {
  const loggedUser = await getUser();

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold text-5xl md:text-6xl">Resume Builder</h1>
        <div className="space-x-2">
          {/* <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button> */}
          <Button>Click</Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <ResumeTabClient loggedUser={loggedUser} />
      </Tabs>
    </div>
  );
}
