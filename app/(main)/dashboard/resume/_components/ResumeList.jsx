"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { JobCard } from "../../_components/JobCard";
import { Loader2 } from "lucide-react";

import { ResumeCard } from "./ResumeCard";

const BATCH_SIZE = 9;

export default function ResumeList({ resumes }) {
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    setDisplayedPosts(resumes.slice(0, BATCH_SIZE));
    setCurrentIndex(BATCH_SIZE);
    currentIndexRef.current = BATCH_SIZE;
    // Cleanup: If you want to be extra safe, clear displayedPosts on unmount
    return () => {
      setDisplayedPosts([]);
      setCurrentIndex(BATCH_SIZE);
      currentIndexRef.current = BATCH_SIZE;
    };
  }, [resumes]);

  // Keep ref in sync
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const loadMorePosts = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedPosts((prev) => {
        const nextPosts = resumes.slice(
          currentIndexRef.current,
          currentIndexRef.current + BATCH_SIZE
        );
        // Filter out duplicates by id
        const prevIds = new Set(prev.map((resume) => resume.id));
        const uniqueNextPosts = nextPosts.filter(
          (resume) => !prevIds.has(resume.id)
        );
        return [...prev, ...uniqueNextPosts];
      });
      setCurrentIndex((prev) => prev + BATCH_SIZE);
      setIsLoading(false);
    }, 500);
  }, [resumes]);

  useEffect(() => {
    if (currentIndex >= resumes.length) return; // No more to load

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
  }, [currentIndex, resumes.length, isLoading, loadMorePosts]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPosts.map((resume) => (
          <ResumeCard key={resume.id} {...resume} />
        ))}
      </div>

      {/* Loading indicator */}
      {currentIndex < resumes.length && (
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
