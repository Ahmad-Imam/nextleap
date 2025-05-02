import { getJobPosts } from "@/actions/job";
import JobList from "./_components/JobList";

export const metadata = {
  title: "NextLeap - Jobs",
  description: "View all your tracked jobs",
};

export default async function JobsPage() {
  const jobPosts = await getJobPosts();

  return (
    <div className="p-4 mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">All Tracked Jobs</h1>
      {jobPosts.length === 0 ? (
        <div className="text-gray-500">No jobs found.</div>
      ) : (
        <JobList jobPosts={jobPosts} />
      )}
    </div>
  );
}
