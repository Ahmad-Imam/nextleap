"use client";

import { analyzeResumeAtsForJob } from "@/actions/ats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const CATEGORY_ORDER = [
  "keywordMatch",
  "skillsAlignment",
  "experienceRelevance",
  "sectionCompleteness",
  "clarityImpact",
];

const CATEGORY_LABELS = {
  keywordMatch: "Keyword Match",
  skillsAlignment: "Skills Alignment",
  experienceRelevance: "Experience Relevance",
  sectionCompleteness: "Section Completeness",
  clarityImpact: "Clarity & Impact",
};

function scoreToneClass(score) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function JobAtsScore({ jobId, resumes = [] }) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes?.[0]?.id || "");
  const {
    data: atsData,
    loading: atsLoading,
    error: atsError,
    fn: analyzeAtsFn,
  } = useFetch(analyzeResumeAtsForJob);

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === selectedResumeId),
    [resumes, selectedResumeId],
  );

  useEffect(() => {
    if (atsError) {
      toast.error(atsError?.message || "Unable to analyze ATS score");
    }
  }, [atsError]);

  async function handleAnalyzeAts() {
    if (!selectedResumeId) {
      toast.error("Please select a resume first.");
      return;
    }

    await analyzeAtsFn({
      jobId,
      resumeId: selectedResumeId,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Resume Match</CardTitle>
        <CardDescription>
          Analyze how well a selected resume matches this job posting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              You need at least one saved resume to run ATS analysis.
            </p>
            <Link href="/dashboard/resume-builder">
              <Button>Create Resume</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="w-full md:max-w-sm space-y-2">
                <p className="text-sm font-medium">Select Resume</p>
                <Select
                  value={selectedResumeId}
                  onValueChange={setSelectedResumeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full md:min-w-[140px] md:w-auto"
                disabled={atsLoading || !selectedResumeId}
                onClick={handleAnalyzeAts}
              >
                {atsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze ATS"
                )}
              </Button>
            </div>

            {atsData && (
              <div className="space-y-6">
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                      <p
                        className={cn(
                          "text-4xl font-bold leading-none mt-1",
                          scoreToneClass(atsData.overallScore),
                        )}
                      >
                        {atsData.overallScore}
                        <span className="text-xl text-muted-foreground"> / 100</span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">Resume</p>
                      <p className="font-medium">{atsData.resumeName || selectedResume?.name}</p>
                    </div>
                  </div>
                  <Progress value={atsData.overallScore} />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Score Breakdown</h3>
                  {CATEGORY_ORDER.map((key) => {
                    const category = atsData.weightedBreakdown?.[key];
                    if (!category) return null;
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium">{CATEGORY_LABELS[key]}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.score}/100 • wt {category.weight}% • +{category.contribution}
                          </p>
                        </div>
                        <Progress value={category.score} />
                        {category.note ? (
                          <p className="text-xs text-muted-foreground">{category.note}</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Keyword Match Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Matched keywords ({atsData.details?.keywordMatch?.matchedCount || 0}/
                      {atsData.details?.keywordMatch?.totalKeywords || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(atsData.details?.keywordMatch?.matchedKeywords || [])
                        .slice(0, 12)
                        .map((keyword) => (
                          <Badge key={`m-${keyword}`} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      {(atsData.details?.keywordMatch?.matchedKeywords || []).length ===
                      0 ? (
                        <p className="text-xs text-muted-foreground">
                          No direct keyword matches found yet.
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Missing keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {(atsData.details?.keywordMatch?.missingKeywords || [])
                        .slice(0, 12)
                        .map((keyword) => (
                          <Badge key={`x-${keyword}`} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      {(atsData.details?.keywordMatch?.missingKeywords || []).length ===
                      0 ? (
                        <p className="text-xs text-muted-foreground">
                          Great — no high-priority keyword gaps detected.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Top Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {(atsData.topStrengths || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {(atsData.topStrengths || []).length === 0 ? (
                        <li className="text-muted-foreground">No strengths detected yet.</li>
                      ) : null}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Top Gaps</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {(atsData.topGaps || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {(atsData.topGaps || []).length === 0 ? (
                        <li className="text-muted-foreground">No major gaps detected yet.</li>
                      ) : null}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recommended Improvements</h3>
                  <div className="space-y-3">
                    {(atsData.suggestions || []).map((suggestion, idx) => (
                      <div key={`${suggestion.title}-${idx}`} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">{suggestion.title}</p>
                          <Badge variant="outline">{suggestion.priority || "medium"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.action}
                        </p>
                      </div>
                    ))}
                    {(atsData.suggestions || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No improvement suggestions available yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
