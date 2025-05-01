import {
  getJobPostByBookmark,
  getJobPosts,
  getJobPostsByApplication,
  getUpcomingInterviewsForUser,
} from "@/actions/job";
import { getUserResumes } from "@/actions/user";
import { DashboardHeader } from "./_components/DashboardHeader";
import DashboardTab from "./_components/DashboardTabs/DashboardTab";
import { UpcomingInterviews } from "./_components/UpcomingInterviews";

export const metadata = {
  title: "NextStep - Dashboard",
  description: "Track your job applications and interviews",
};

export default async function DashboardPage() {
  const allJobPosts = await getJobPosts();
  // console.log(allJobPosts);

  const bookmarkedJobPosts = await getJobPostByBookmark();

  const applicationJobPosts = await getJobPostsByApplication();
  // console.log(applicationJobPosts.length);

  const upcomingInterviews = await getUpcomingInterviewsForUser();

  const userResumes = await getUserResumes();

  // console.log(upcomingInterviews);

  return (
    <div className="p-4 mx-auto w-full flex flex-col gap-4 md:gap-6 lg:gap-10 items-start justify-between">
      <DashboardHeader
        createdJobsCount={allJobPosts.length || 0}
        appliedJobsCount={applicationJobPosts.length || 0}
        bookmarkedJobsCount={bookmarkedJobPosts.length || 0}
        resumesCount={userResumes?.resume.length || 0}
      />

      <DashboardTab
        allJobPosts={allJobPosts}
        bookmarkedJobPosts={bookmarkedJobPosts}
        applicationJobPosts={applicationJobPosts}
      />

      <UpcomingInterviews upcomingInterviews={upcomingInterviews} />
    </div>
  );
}
