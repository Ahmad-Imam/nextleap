import JobDetails from "./_components/JobDetails";

export default function JobSinglePage() {
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

  return (
    <main className="flex items-center justify-center min-h-screen">
      <JobDetails jobPosting={jobPosting} />
    </main>
  );
}
