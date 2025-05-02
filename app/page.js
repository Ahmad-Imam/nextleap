import HomePage from "@/components/HomePage";

export const metadata = {
  title: "NextLeap - Home",
  description: "Take your career to next level",
};

// import { getUserOnboardingStatus } from "@/actions/user";

export default async function Home() {
  // const { isOnboarded } = await getUserOnboardingStatus();

  // if (!isOnboarded) {
  //   return redirect("/onboarding");
  // }

  return (
    <div className="flex flex-col items-center">
      <HomePage />
    </div>
  );
}
