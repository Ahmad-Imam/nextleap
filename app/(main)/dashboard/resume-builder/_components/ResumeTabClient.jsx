// ResumeTabClient.jsx
"use client";
import React, { Suspense, useState } from "react";
import ResumeOrder from "./ResumeOrder";
import ResumeBuilder from "./ResumeBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from "./ResumeForm";
import { Button } from "@/components/ui/button";

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
  // console.log(items);

  const [selectMode, setSelectMode] = useState(loggedUser);
  const [resumeMode, setResumeMode] = useState(false);
  console.log("tab client");
  // console.log(selectMode);

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
          <div className="flex flex-col justify-between items-center gap-2 ">
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
            <Suspense fallback={<div>Loading...</div>}>
              <ResumeForm
                loggedUser={selectMode}
                handleModeChange={handleModeChange}
              />
            </Suspense>
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
