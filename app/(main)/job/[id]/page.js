import { getJobPostById } from "@/actions/job";
import { getUserResumes } from "@/actions/user";
import JobAtsScore from "./_components/JobAtsScore";
import JobCoverLetter from "./_components/JobCoverLetter";
import JobDetails from "./_components/JobDetails";

export const metadata = {
  title: "NextLeap - Job Details",
  description: "Job Details",
};

export default async function JobSinglePage({ params }) {
  const { id } = await params;

  const [jobPost, userResumes] = await Promise.all([
    getJobPostById(id),
    getUserResumes(),
  ]);

  return (
    <main className="min-h-screen w-full px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      {jobPost && (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <JobDetails jobPost={jobPost} />
          <JobAtsScore jobId={id} resumes={userResumes?.resume || []} />
          <JobCoverLetter jobPost={jobPost} />
        </div>
      )}

      {!jobPost && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="mt-2 text-lg">
            The job you are looking for does not exist.
          </p>
        </div>
      )}
    </main>
  );
}
