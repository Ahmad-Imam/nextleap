"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function MainError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="max-w-lg w-full border rounded-xl p-6 space-y-4 text-center">
        <h2 className="text-2xl font-bold">We couldn&apos;t load this page</h2>
        <p className="text-sm text-muted-foreground">
          Please retry. If it keeps failing, return to your dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/dashboard">Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
