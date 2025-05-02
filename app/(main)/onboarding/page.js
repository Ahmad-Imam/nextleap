import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/OnboardingForm";

export const metadata = {
  title: "NextLeap - Onboarding",
  description: "Onboarding page",
};

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <OnboardingForm />
    </main>
  );
}
