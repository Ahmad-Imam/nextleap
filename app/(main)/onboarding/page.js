// import { industries } from "@/data/industries";

import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/OnboardingForm";

export const metadata = {
  title: "NextStep - Onboarding",
  description: "Onboarding page",
};

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  // console.log(isOnboarded);

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <OnboardingForm />
    </main>
  );
}
