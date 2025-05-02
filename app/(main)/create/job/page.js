import JobForm from "./_components/JobForm";

export const metadata = {
  title: "NextLeap - Create Job",
  description: "Create a new job to track your progress",
};

export default async function JobPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <JobForm />
    </main>
  );
}
