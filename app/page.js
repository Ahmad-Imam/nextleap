import HomePage from "@/components/HomePage";

export default async function Home() {
  // const { isOnboarded } = await getUserOnboardingStatus();

  // if (!isOnboarded) {
  //   return redirect("/onboarding");
  // }

  return (
    <div>
      <HomePage />
    </div>
  );
}
