import { getJobPostByBookmark } from "@/actions/job";
import JobList from "../jobs/_components/JobList";

export const metadata = {
  title: "NextLeap - Bookmarks",
  description: "View all your bookmarked jobs",
};

export default async function JobsBookmarkPage() {
  const jobPosts = await getJobPostByBookmark();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Bookmarked Jobs</h1>
      {jobPosts.length > 0 ? (
        <JobList jobPosts={jobPosts} />
      ) : (
        <p className="text-gray-500">No bookmarked jobs found.</p>
      )}
    </div>
  );
}
