"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  console.error(error);

  return (
    <html>
      <body>
        <div className="min-h-screen w-full flex items-center justify-center px-4 bg-background text-foreground">
          <div className="max-w-lg w-full border rounded-xl p-6 space-y-4 text-center">
            <h2 className="text-2xl font-bold">Application error</h2>
            <p className="text-sm text-muted-foreground">
              A critical error occurred. Please retry the action.
            </p>
            <div className="flex gap-3 justify-center">
              <Button type="button" onClick={() => reset()}>
                Retry
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
