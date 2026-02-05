"use client";

import { deleteResume, updateResumeName } from "@/actions/resume";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ResumeName({ name, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (isEditing) {
      try {
        setIsLoading(true);
        await updateResumeName(id, editedName);
        setIsEditing(!isEditing);
        setIsLoading(false);
        toast.success("Resume name updated successfully!");
      } catch (error) {
        toast.error("Error updating resume name. Please try again.");

        console.error("Error saving name:", error);
      }
    } else {
      setIsEditing(!isEditing);
      setEditedName(name);
    }
  }

  async function handleDeleteResume() {
    try {
      setIsDeleting(true);
      await deleteResume(id);
      toast.success("Resume deleted successfully!");
      router.push("/dashboard/resume");
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Error deleting resume. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-10">
        {isEditing ? (
          <Input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        ) : (
          <h1 className="text-xl font-semibold">Title: {editedName}</h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            disabled={isLoading}
            onClick={() => handleSave()}
            className=" hover:underline"
          >
            {isEditing ? (isLoading ? "Updating" : "Save") : "Edit"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this resume from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={handleDeleteResume}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
