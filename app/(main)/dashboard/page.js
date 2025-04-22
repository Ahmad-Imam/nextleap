import {
  getJobPostByBookmark,
  getJobPosts,
  getJobPostsByApplication,
  getUpcomingInterviewsForUser,
} from "@/actions/job";
import { DashboardHeader } from "./_components/DashboardHeader";
import DashboardTab from "./_components/DashboardTabs/DashboardTab";
import { UpcomingInterviews } from "./_components/UpcomingInterviews";

export default async function DashboardPage() {
  const allJobPosts = await getJobPosts();
  // console.log(allJobPosts);

  const bookmarkedJobPosts = await getJobPostByBookmark();

  const applicationJobPosts = await getJobPostsByApplication();
  // console.log(applicationJobPosts.length);

  const upcomingInterviews = await getUpcomingInterviewsForUser();
  // console.log(upcomingInterviews);

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-4 md:gap-6 lg:gap-10 items-start justify-between">
      <DashboardHeader />

      <DashboardTab
        allJobPosts={allJobPosts}
        bookmarkedJobPosts={bookmarkedJobPosts}
        applicationJobPosts={applicationJobPosts}
      />

      <UpcomingInterviews upcomingInterviews={upcomingInterviews} />
    </div>
  );
}
