import { getUserResumes } from "@/actions/user";
import ResumeList from "./_components/ResumeList";

export default async function ResumePage() {
  const loggedUser = await getUserResumes();
  //   console.log(loggedUser?.resume);
  //   console.log(loggedUser);
  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">All Resumes</h1>
      {loggedUser?.resume?.length > 0 ? (
        <ResumeList resumes={loggedUser?.resume} />
      ) : (
        <div className="text-center text-gray-500">No resumes found.</div>
      )}
    </div>
  );
}
