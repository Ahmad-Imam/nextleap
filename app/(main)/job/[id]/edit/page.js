import { getJobPostById } from "@/actions/job";
import EditJobForm from "./_components/EditJobForm";

export const metadata = {
  title: "NextLeap - Edit Job",
  description: "Edit tracked job details",
};

export default async function EditJobPage({ params }) {
  const { id } = await params;
  const jobPost = await getJobPostById(id);

  if (!jobPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="mt-2 text-lg">The job you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <EditJobForm jobPost={jobPost} />
    </main>
  );
}
