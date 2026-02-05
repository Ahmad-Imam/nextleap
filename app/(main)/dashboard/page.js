import {
  getApplicationLimitAnalytics,
  getJobPostByBookmark,
  getJobPosts,
  getJobPostsByApplication,
  getUpcomingInterviewsForUser,
} from "@/actions/job";
import { ApplicationLimits } from "./_components/ApplicationLimits";
import { getUserResumes } from "@/actions/user";
import { DashboardHeader } from "./_components/DashboardHeader";
import DashboardTab from "./_components/DashboardTabs/DashboardTab";
import { UpcomingInterviews } from "./_components/UpcomingInterviews";

export const metadata = {
  title: "NextLeap - Dashboard",
  description: "Track your job applications and interviews",
};

export default async function DashboardPage() {
  const [
    allJobPosts,
    bookmarkedJobPosts,
    applicationJobPosts,
    upcomingInterviews,
    userResumes,
    applicationAnalytics,
  ] = await Promise.all([
    getJobPosts(),
    getJobPostByBookmark(),
    getJobPostsByApplication(),
    getUpcomingInterviewsForUser(),
    getUserResumes(),
    getApplicationLimitAnalytics(),
  ]);

  return (
    <div className="p-4 mx-auto w-full flex flex-col gap-4 md:gap-6 lg:gap-10 items-start justify-between">
      <DashboardHeader
        createdJobsCount={allJobPosts.length || 0}
        appliedJobsCount={applicationJobPosts.length || 0}
        bookmarkedJobsCount={bookmarkedJobPosts.length || 0}
        resumesCount={userResumes?.resume.length || 0}
      />

      <ApplicationLimits analytics={applicationAnalytics} />

      <DashboardTab
        allJobPosts={allJobPosts}
        bookmarkedJobPosts={bookmarkedJobPosts}
        applicationJobPosts={applicationJobPosts}
      />

      <UpcomingInterviews upcomingInterviews={upcomingInterviews} />
    </div>
  );
}
