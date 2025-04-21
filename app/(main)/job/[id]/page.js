import { getJobPostById } from "@/actions/job";
import JobDetails from "./_components/JobDetails";
import JobCoverLetter from "./_components/JobCoverLetter";

export default async function JobSinglePage({ params }) {
  const jobPosting = {
    jobTitle: "Software Engineer",
    jobDescription:
      "Develop and maintain software applications. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    companyName: "Tech Corp",
    location: "New York, NY | Remote",
    salary: "$80,000",
    jobType: "FULL TIME",
    industry: "TECH",
    level: "Mid",
    jobRequirements: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of experience in software development",
      "Proficiency in JavaScript and Python.",
    ],
    responsibilities: [
      "Develop software solutions",
      "Collaborate with cross-functional teams",
      "Ensure code quality and performance.",
    ],
  };
  const { id } = await params;
  console.log("id", id);

  const jobPost = await getJobPostById(id);
  // console.log(jobPost);
  // console.log("jobPost", jobPost);

  return (
    <main className="flex items-center justify-center min-h-screen">
      {jobPost && (
        <div className="flex flex-col gap-4">
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
