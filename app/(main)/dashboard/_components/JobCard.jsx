import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import {
  BanknoteIcon,
  ClockIcon,
  MapPinIcon,
  MoreVerticalIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export function JobCard({
  jobTitle,
  companyName,
  location,
  salary,
  applicants,
  createdAt,
  status,
  id,
}) {
  const formattedDate = formatDate(createdAt);

  return (
    <Card className="overflow-hidden flex flex-col justify-between">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{jobTitle}</h3>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Job</DropdownMenuItem>
                <DropdownMenuItem>View Applicants</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-2 mt-4">
            <div className="flex items-center text-sm">
              <MapPinIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{location}</span>
            </div>
            {salary != "" && (
              <div className="flex items-center text-sm">
                <BanknoteIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span>{salary}</span>
              </div>
            )}
            {applicants !== undefined && (
              <div className="flex items-center text-sm">
                <UsersIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span>{applicants} applicants</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>Created at {formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex md:flex-col xl:flex-row justify-between items-center gap-2 md:items-start lg:items-center">
        <div className="flex items-center">
          {status === "open" && (
            <>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Open
              </Badge>
            </>
          )}
          {status === "applied" && (
            <>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Applied
              </Badge>
            </>
          )}
          {status === "interview" && (
            <>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Interview Scheduled
              </Badge>
            </>
          )}
          {status === "selected" && (
            <>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Selected
              </Badge>
            </>
          )}
          {status === "rejected" && (
            <>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Not Selected
              </Badge>
            </>
          )}
        </div>
        <Link href={`/job/${id}`} className="cursor-pointer">
          <Button className="cursor-pointer">View Details</Button>
        </Link>

        {/* {status === "active" && (
          <>
            <Button variant="outline" size="sm">
              View Applicants
            </Button>
            <Button size="sm">Edit Job</Button>
          </>
        )}

        {status === "bookmarked" && (
          <>
            <Button variant="outline" size="sm">
              Remove Bookmark
            </Button>
            <Button size="sm">Apply Now</Button>
          </>
        )}

        {status === "applied" && !applicationStatus && (
          <>
            <Button variant="outline" size="sm">
              View Application
            </Button>
            <Button size="sm" variant="ghost">
              Withdraw
            </Button>
          </>
        )} */}
      </CardFooter>
    </Card>
  );
}
