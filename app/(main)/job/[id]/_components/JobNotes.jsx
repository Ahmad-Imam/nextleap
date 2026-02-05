"use client";

import { updateJobNotes } from "@/actions/job";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobNotes({ jobId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const {
    loading: isSaving,
    fn: saveNotesFn,
    data: saveResult,
    error: saveError,
  } = useFetch(updateJobNotes);

  useEffect(() => {
    if (saveResult?.success && !isSaving) {
      toast.success("Notes updated.");
    }
  }, [saveResult, isSaving]);

  useEffect(() => {
    if (saveError) {
      toast.error(saveError.message || "Failed to update notes.");
    }
  }, [saveError]);

  async function handleSaveNotes() {
    await saveNotesFn(jobId, notes);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Notes</h2>
      <div className="space-y-3">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any personal notes about this job..."
          className="min-h-[120px] whitespace-pre-wrap"
        />
        <div>
          <Button onClick={handleSaveNotes} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Notes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
