import { getUserOnboardingStatus } from "@/actions/user";
import Image from "next/image";

export default async function Home() {
  // const { isOnboarded } = await getUserOnboardingStatus();

  // if (!isOnboarded) {
  //   return redirect("/onboarding");
  // }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
          Take your career to the next level with
          <br />
          tracking and insights
        </h1>
      </div>
    </div>
  );
}
