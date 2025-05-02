"use client";

import { updateResumeName } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function ResumeName({ name, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);

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
        <Button
          disabled={isLoading}
          onClick={() => handleSave()}
          className=" hover:underline"
        >
          {isEditing ? (isLoading ? "Updating" : "Save") : "Edit"}
        </Button>
      </div>
    </>
  );
}
