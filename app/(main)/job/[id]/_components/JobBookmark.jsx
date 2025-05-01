"use client";

import { updateJobBookmark } from "@/actions/job";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { BookmarkMinusIcon, BookmarkPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JobBookmark({ jobId, isBookmark }) {
  const {
    data,
    error,
    isLoading,
    fn: bookmarkJobPost,
  } = useFetch(updateJobBookmark);

  const [bookmarked, setBookmarked] = useState(isBookmark);

  async function handleClick() {
    await bookmarkJobPost(jobId, !bookmarked);
    if (error) {
      console.error("Error updating job post bookmark:", error);
      toast.error("Failed to update job post bookmark.");
      return;
    }
    setBookmarked(!bookmarked);

    toast.success("Job bookmark updated successfully.");
  }

  return (
    <Button
      className="w-full flex items-center justify-center gap-2 text-accent rounded-md p-2 hover:cursor-pointer"
      onClick={handleClick}
      disabled={isLoading}
    >
      {bookmarked ? (
        <BookmarkMinusIcon className="h-6 w-6 mr-1 text-xl" />
      ) : (
        <BookmarkPlusIcon className="h-6 w-6 mr-1 text-xl" />
      )}

      <span className="text-lg font-semibold">
        {isLoading ? "Loading..." : bookmarked ? "Bookmark -" : "Bookmark +"}
      </span>
    </Button>
  );
}
