import { getJobPostsByApplication } from "@/actions/job";
import JobList from "../jobs/_components/JobList";

export const metadata = {
  title: "NextLeap - Applications",
  description: "View all your applications",
};

export default async function ApplicationsPage() {
  const jobPosts = await getJobPostsByApplication();

  return (
    <div className="p-4 mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">All Applied Jobs</h1>
      <JobList jobPosts={jobPosts} />
    </div>
  );
}
