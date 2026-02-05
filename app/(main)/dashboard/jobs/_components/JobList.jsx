"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobCard } from "../../_components/JobCard";
import SortJobs from "./SortJobs";

const BATCH_SIZE = 9;

export default function JobList({ jobPosts: initialJobPosts }) {
  const [jobPosts, setJobPosts] = useState(() => {
    return [...initialJobPosts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
  const [searchText, setSearchText] = useState("");

  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);

  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return jobPosts;

    return jobPosts.filter((job) => {
      const jobTitle = (job?.jobTitle || "").toLowerCase();
      const companyName = (job?.companyName || "").toLowerCase();
      return jobTitle.includes(query) || companyName.includes(query);
    });
  }, [jobPosts, searchText]);

  useEffect(() => {
    setDisplayedPosts(filteredPosts.slice(0, BATCH_SIZE));
    setCurrentIndex(BATCH_SIZE);
    currentIndexRef.current = BATCH_SIZE;

    return () => {
      setDisplayedPosts([]);
      setCurrentIndex(BATCH_SIZE);
      currentIndexRef.current = BATCH_SIZE;
    };
  }, [filteredPosts]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const loadMorePosts = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedPosts((prev) => {
        const nextPosts = filteredPosts.slice(
          currentIndexRef.current,
          currentIndexRef.current + BATCH_SIZE
        );

        const prevIds = new Set(prev.map((job) => job.id));
        const uniqueNextPosts = nextPosts.filter((job) => !prevIds.has(job.id));
        return [...prev, ...uniqueNextPosts];
      });
      setCurrentIndex((prev) => prev + BATCH_SIZE);
      setIsLoading(false);
    }, 500);
  }, [filteredPosts]);

  useEffect(() => {
    if (currentIndex >= filteredPosts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [currentIndex, filteredPosts.length, isLoading, loadMorePosts]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by job title or company name"
          className="w-full md:max-w-sm"
        />
        <SortJobs jobPosts={initialJobPosts} onSort={setJobPosts} />
      </div>
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((jobPost) => (
            <JobCard key={jobPost.id} {...jobPost} />
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No jobs matched your search.
        </div>
      )}

      {/* Loading indicator */}
      {currentIndex < filteredPosts.length && (
        <div ref={loaderRef} className="flex justify-center p-4 mt-4">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
    </>
  );
}
