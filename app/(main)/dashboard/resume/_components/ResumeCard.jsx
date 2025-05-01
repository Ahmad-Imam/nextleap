import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ClockIcon } from "lucide-react";
import Link from "next/link";

export function ResumeCard({ name, createdAt, id }) {
  const formattedDate = formatDate(createdAt);

  return (
    <Card className="overflow-hidden flex flex-col justify-between">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">Title: {name}</h3>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>Created at {formattedDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/resume/${id}`} className="cursor-pointer">
          <Button className="cursor-pointer">Preview</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
