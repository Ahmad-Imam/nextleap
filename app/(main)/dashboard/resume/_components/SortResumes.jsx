"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpDown,
  CalendarClock,
  Check,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function SortResumes({ resumes, onSort }) {
  const [activeSort, setActiveSort] = useState("dateNewest");

  const handleSort = (sortType) => {
    setActiveSort(sortType);

    const sortedResumes = [...resumes].sort((a, b) => {
      switch (sortType) {
        case "titleAsc":
          return (a.name || "").localeCompare(b.name || "");
        case "titleDesc":
          return (b.name || "").localeCompare(a.name || "");
        case "dateNewest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "dateOldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    onSort(sortedResumes);
  };

  const getSortLabel = () => {
    switch (activeSort) {
      case "titleAsc":
        return "Title (A-Z)";
      case "titleDesc":
        return "Title (Z-A)";
      case "dateNewest":
        return "Newest First";
      case "dateOldest":
        return "Oldest First";
      default:
        return "Sort by";
    }
  };

  const getSortIcon = () => {
    switch (activeSort) {
      case "titleAsc":
        return <ArrowUpAZ className="mr-2 h-4 w-4" />;
      case "titleDesc":
        return <ArrowDownAZ className="mr-2 h-4 w-4" />;
      case "dateNewest":
        return <Clock className="mr-2 h-4 w-4" />;
      case "dateOldest":
        return <CalendarClock className="mr-2 h-4 w-4" />;
      default:
        return <ArrowUpDown className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {getSortIcon()}
          Sort by: {getSortLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem
          onClick={() => handleSort("titleAsc")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <ArrowUpAZ className="mr-2 h-4 w-4" />
            Title (A-Z)
          </div>
          {activeSort === "titleAsc" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSort("titleDesc")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <ArrowDownAZ className="mr-2 h-4 w-4" />
            Title (Z-A)
          </div>
          {activeSort === "titleDesc" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSort("dateNewest")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Newest First
          </div>
          {activeSort === "dateNewest" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSort("dateOldest")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <CalendarClock className="mr-2 h-4 w-4" />
            Oldest First
          </div>
          {activeSort === "dateOldest" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
