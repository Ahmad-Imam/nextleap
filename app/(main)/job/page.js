import React from "react";

// import { industries } from "@/data/industries";

import { redirect } from "next/navigation";
import JobForm from "./_components/JobForm";

export default async function JobPage() {
  //   if (isOnboarded) {
  //     redirect("/dashboard");
  //   }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <JobForm />
    </main>
  );
}
