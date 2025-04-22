import { getUser } from "@/actions/user";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeTabClient from "./_components/ResumeTabClient";

export default async function ResumeBuilderPage() {
  const loggedUser = await getUser();

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4">
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
          {/* <Button>Click</Button> */}
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
