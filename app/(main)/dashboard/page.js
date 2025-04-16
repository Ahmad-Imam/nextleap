import { DashboardHeader } from "./_components/DashboardHeader";
import { UpcomingInterviews } from "./_components/UpcomingInterviews";
import DashboardTab from "./_components/DashboardTabs/DashboardTab";
import {
  getJobPostByBookmark,
  getJobPosts,
  getJobPostsByApplication,
} from "@/actions/job";

export default async function DashboardPage() {
  const allJobPosts = await getJobPosts();
  // console.log(allJobPosts);

  const bookmarkedJobPosts = await getJobPostByBookmark();

  const applicationJobPosts = await getJobPostsByApplication();
  // console.log(applicationJobPosts.length);

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 lg:gap-10 items-start justify-between">
      <DashboardHeader />

      <DashboardTab
        allJobPosts={allJobPosts}
        bookmarkedJobPosts={bookmarkedJobPosts}
        applicationJobPosts={applicationJobPosts}
      />

      <UpcomingInterviews />
    </div>
  );
}
