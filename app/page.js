import HomePage from "@/components/HomePage";

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
