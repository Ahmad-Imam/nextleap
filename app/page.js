import HomePage from "@/components/HomePage";

export const metadata = {
  title: "NextLeap - Home",
  description: "Take your career to next level",
};

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <HomePage />
    </div>
  );
}
