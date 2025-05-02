"use client";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ResumeBuilder from "./ResumeBuilder";
import ResumeForm from "./ResumeForm";
import ResumeOrder from "./ResumeOrder";

export default function ResumeTabClient({ loggedUser }) {
  const listItems = [
    {
      text: "Education",
      checked: false,
      id: 1,
      description: "educationToMarkdown",
    },
    {
      text: "Experience",
      checked: false,
      id: 3,
      description: "experienceToMarkdown",
    },
    {
      text: "Skills",
      checked: false,
      id: 4,
      description: "skillsToMarkdown",
    },

    {
      text: "Projects",
      checked: false,
      id: 2,
      description: "projectsToMarkdown",
    },
  ];

  const [items, setItems] = useState(listItems);

  const [selectMode, setSelectMode] = useState(loggedUser);
  const [resumeMode, setResumeMode] = useState(false);

  function handleItemsChange(newItems) {
    if (newItems.length === 0) {
      setItems(listItems);
      return;
    }
    setItems(newItems);
  }

  function handleModeChange(newMode) {
    setSelectMode(newMode);
  }

  return (
    <>
      <TabsContent value="edit">
        {!resumeMode && (
          <div className="flex flex-col justify-between items-center space-y-6 pt-6 ">
            <Button
              onClick={() => {
                setSelectMode(loggedUser);
                setResumeMode(true);
              }}
            >
              Use user profile
            </Button>
            <Button
              onClick={() => {
                setSelectMode(loggedUser?.resumeContent);
                setResumeMode(true);
              }}
              disabled={!loggedUser?.resumeContent}
            >
              Use last used resume
            </Button>
          </div>
        )}

        {resumeMode && (
          <>
            <ResumeForm
              loggedUser={selectMode}
              handleModeChange={handleModeChange}
            />

            <ResumeOrder items={items} setItems={handleItemsChange} />
          </>
        )}
      </TabsContent>

      <TabsContent value="preview">
        <ResumeBuilder loggedUser={selectMode} items={items} />
      </TabsContent>
    </>
  );
}
