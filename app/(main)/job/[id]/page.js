import { getJobPostById } from "@/actions/job";
import JobCoverLetter from "./_components/JobCoverLetter";
import JobDetails from "./_components/JobDetails";

export const metadata = {
  title: "NextStep - Job Details",
  description: "Job Details",
};

export default async function JobSinglePage({ params }) {
  const { id } = await params;
  // console.log("id", id);

  const jobPost = await getJobPostById(id);
  // console.log(jobPost);
  // console.log("jobPost", jobPost);

  return (
    <main className="flex items-center justify-center min-h-screen pt-10">
      {jobPost && (
        <div className="flex flex-col gap-10">
          <JobDetails jobPost={jobPost} />
          <JobCoverLetter jobPost={jobPost} />
        </div>
      )}

      {!jobPost && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="mt-2 text-lg">
            The job you are looking for does not exist.
          </p>
        </div>
      )}
    </main>
  );
}
