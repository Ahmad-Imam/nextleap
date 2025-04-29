"use client";
// import { onboardingSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateUserResumeContent } from "@/actions/user";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TestTimeout = async () => {
  console.log("TestTimeout called");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 2000); // 2 seconds delay
  });
};

export default function ResumeForm({ loggedUser, handleModeChange }) {
  console.log("form");
  const [modeChanged, setModeChanged] = useState(false);
  const [newValues, setNewValues] = useState({});

  // console.log(loggedUser);
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const router = useRouter();
  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUserResumeContent);
  ///imlement the updateUserFn function to update the user data resumecontent

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    // resolver: zodResolver(onboardingSchema),
    defaultValues: {
      bio: loggedUser?.bio || "",
      education: loggedUser?.education || [],
      experience: loggedUser?.experience || [],
      proj: loggedUser?.proj || [],
      socials: loggedUser?.socials || [],
      skills: loggedUser?.skills || [],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
    move: moveEducation,
  } = useFieldArray({
    name: "education",
    control,
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
    move: moveExperience,
  } = useFieldArray({
    name: "experience",
    control,
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    name: "socials",
    control,
  });

  const {
    fields: projectFields,
    append: appendProjects,
    remove: removeProjects,
    move: moveProjects,
  } = useFieldArray({
    name: "proj",
    control,
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    move: moveSkill,
  } = useFieldArray({
    name: "skills",
    control,
  });

  const onSubmitForm = async (values) => {
    try {
      const newValues = {
        name: loggedUser.name,
        email: loggedUser.email,
        ...values,
      };
      console.log(newValues);
      await updateUserFn(newValues);
      setNewValues(newValues);
      if (updateError) {
        toast.error("Error updating resume: " + updateError.message);
        return;
      }
    } catch (error) {
      console.error("Resume settings error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading && !modeChanged) {
      toast.success("Resume settings updated successfully!");
      handleModeChange(newValues); // Only call once
      setModeChanged(true);
      router.refresh();
    }
  }, [updateResult, updateLoading, modeChanged]);

  return (
    <div className="flex items-center justify-center bg-background w-full">
      <Card className="w-full my-10 mx-4">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Create your Resume
          </CardTitle>
          <CardDescription className={"text-lg"}>
            Add your education, experience, project to build your resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32"
                {...register("bio", {
                  required: "Bio is required",
                })}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4 flex flex-col items-center ">
              <Label className={"text-xl font-bold"}>Skills</Label>
              <div className="w-full flex flex-col gap-6">
                {skillFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 items-center justify-center w-full"
                  >
                    <div className="flex justify-between gap-4  w-full">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`skills[${idx}].name`}>Skill</Label>
                        <Input
                          {...register(`skills.${idx}.name`, {
                            required: "Skill name is required",
                          })}
                          id={`skills[${idx}].name`}
                          placeholder="e.g. React"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`skills[${idx}].exp`}>
                          Experience (years)
                        </Label>
                        <Input
                          {...register(`skills.${idx}.exp`, {
                            required: "Experience is required",
                            valueAsNumber: true,
                          })}
                          id={`skills[${idx}].exp`}
                          placeholder="e.g. 2"
                          type="number"
                          min={0}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`skills[${idx}].level`}>Level</Label>
                        <Select
                          value={watch(`skills.${idx}.level`) || ""}
                          onValueChange={(value) =>
                            setValue(`skills.${idx}.level`, value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger
                            id={`skills[${idx}].level`}
                            className="text-lg"
                          >
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Skill Level</SelectLabel>
                              {skillLevels.map((lev) => (
                                <SelectItem
                                  key={lev}
                                  value={lev}
                                  className="text-lg"
                                >
                                  {lev}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6 items-center justify-center">
                      <Button
                        className=" mr-2 text-2xl"
                        variant="destructive"
                        onClick={() => removeSkill(idx)}
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSkill(idx, idx - 1)}
                        variant=""
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        disabled={idx === skillFields.length - 1}
                        onClick={() => moveSkill(idx, idx + 1)}
                        variant=""
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() =>
                  appendSkill({
                    name: "",
                    exp: 0,
                    level: skillLevels[0],
                  })
                }
              >
                Skill +
              </Button>
            </div>

            {/* education */}
            <div className="space-y-2 flex flex-col items-center justify-center py-2">
              <Label className={"text-xl font-bold"}>Education</Label>
              <div className="w-full flex flex-col gap-6">
                {educationFields.map((field, index) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center w-full "
                      key={field.id}
                    >
                      <div className="grid grid-cols-2 gap-4  w-full ">
                        <div className="flex flex-col space-y-2 w-full ">
                          <Label
                            htmlFor={`education[${index}].orgName`}
                            className={"text-lg"}
                          >
                            Institution Name
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`education[${index}].orgName`, {
                              required: "Skills name is required",
                            })}
                            id={`education[${index}].orgName`}
                            name={`education[${index}].orgName`}
                          />
                        </div>
                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`education[${index}].degreeName`}
                            className={"text-lg"}
                          >
                            Degree
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`education[${index}].degreeName`)}
                            id={`education[${index}].degreeName`}
                            name={`education[${index}].degreeName`}
                          />
                        </div>

                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`education[${index}].major`}
                            className={"text-lg"}
                          >
                            Major
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`education[${index}].major`)}
                            id={`education[${index}].major`}
                            name={`education[${index}].major`}
                            placeholder="e.g. Computer Science"
                          />
                        </div>

                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`education[${index}].result`}
                            className={"text-lg"}
                            placeholder="e.g. 3.8/4.0"
                          >
                            Result
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`education[${index}].result`)}
                            id={`education[${index}].result`}
                            name={`education[${index}].result`}
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full ">
                          <Label
                            htmlFor={`education[${index}].startDate`}
                            className="text-lg"
                          >
                            Start Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watch(`education[${index}].startDate`) ? (
                                  format(
                                    new Date(
                                      watch(`education[${index}].startDate`)
                                    ),
                                    "PPP"
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  watch(`education[${index}].startDate`)
                                    ? new Date(
                                        watch(`education[${index}].startDate`)
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setValue(
                                    `education[${index}].startDate`,
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <input
                            type="hidden"
                            {...register(`education[${index}].startDate`, {
                              required: "Start date is required",
                            })}
                            id={`education[${index}].startDate`}
                            name={`education[${index}].startDate`}
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                          <Label
                            htmlFor={`education[${index}].endDate`}
                            className="text-lg"
                          >
                            End Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watch(`education[${index}].endDate`) ? (
                                  format(
                                    new Date(
                                      watch(`education[${index}].endDate`)
                                    ),
                                    "PPP"
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  watch(`education[${index}].endDate`)
                                    ? new Date(
                                        watch(`education[${index}].endDate`)
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setValue(
                                    `education[${index}].endDate`,
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <input
                            type="hidden"
                            {...register(`education[${index}].endDate`, {
                              required: "End date is required",
                            })}
                            id={`education[${index}].endDate`}
                            name={`education[${index}].endDate`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6 items-center justify-center">
                        <Button
                          className=" mr-2 text-2xl"
                          variant="destructive"
                          onClick={() => removeEducation(index)}
                        >
                          -
                        </Button>
                        <Button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveEducation(index, index - 1)}
                          variant=""
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          disabled={index === experienceFields.length - 1}
                          onClick={() => moveEducation(index, index + 1)}
                          variant=""
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() =>
                  appendEducation({
                    degreeName: "",
                    orgName: "",
                    major: "",
                    result: "",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                Education +
              </Button>
            </div>
            {/* project */}
            <div className="space-y-2 flex flex-col items-center justify-center py-2">
              <Label className={"text-xl font-bold"}>Projects</Label>
              <div className="w-full flex flex-col gap-6">
                {projectFields.map((field, index) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center w-full "
                      key={field.id}
                    >
                      <div className="grid grid-cols-2 gap-4  w-full ">
                        <div className="flex flex-col space-y-2 w-full ">
                          <Label
                            htmlFor={`proj[${index}].projName`}
                            className={"text-lg"}
                          >
                            Project Name
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`proj[${index}].projName`, {
                              required: "Skills name is required",
                            })}
                            id={`proj[${index}].projName`}
                            name={`proj[${index}].projName`}
                          />
                        </div>
                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`proj[${index}].tech`}
                            className={"text-lg"}
                          >
                            Tech Stack
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`proj[${index}].tech`)}
                            id={`proj[${index}].tech`}
                            name={`proj[${index}].tech`}
                          />
                        </div>

                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`proj[${index}].url`}
                            className={"text-lg"}
                          >
                            Url
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`proj[${index}].url`)}
                            id={`proj[${index}].url`}
                            name={`proj[${index}].url`}
                          />
                        </div>

                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`proj[${index}].description`}
                            className={"text-lg"}
                          >
                            Project Description
                          </Label>

                          <Textarea
                            id={`proj[${index}].description`}
                            {...register(`proj[${index}].description`)}
                            name={`proj[${index}].description`}
                            placeholder="Tell us about your professional background..."
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                          />
                          {/* <input
                                                className="p-2 border box-border w-full rounded-md text-lg"
                                                type="text"
                                                {...register(`proj[${index}].description`)}
                                                id={`proj[${index}].description`}
                                                name={`proj[${index}].description`}
                                              /> */}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6 items-center justify-center">
                        <Button
                          className=" mr-2 text-2xl"
                          variant="destructive"
                          onClick={() => removeProjects(index)}
                        >
                          -
                        </Button>
                        <Button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveProjects(index, index - 1)}
                          variant=""
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          disabled={index === experienceFields.length - 1}
                          onClick={() => moveProjects(index, index + 1)}
                          variant=""
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() =>
                  appendProjects({
                    projName: "",
                    tech: "",
                    url: "",
                    description: "",
                  })
                }
              >
                Project +
              </Button>
            </div>
            {/* experience */}
            <div className="space-y-2 flex flex-col items-center justify-center py-2">
              <Label className={"text-xl font-bold"}>Experience</Label>
              <div className="w-full flex flex-col gap-6">
                {experienceFields.map((field, index) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center w-full "
                      key={field.id}
                    >
                      <div className="grid grid-cols-2 gap-4  w-full ">
                        <div className="flex flex-col space-y-2 w-full ">
                          <Label
                            htmlFor={`experience[${index}].orgName`}
                            className={"text-lg"}
                          >
                            Organization Name
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`experience[${index}].orgName`, {
                              required: "Skills name is required",
                            })}
                            id={`experience[${index}].orgName`}
                            name={`experience[${index}].orgName`}
                          />
                        </div>
                        <div className="flex flex-col  space-y-2 w-full ">
                          <Label
                            htmlFor={`experience[${index}].jobName`}
                            className={"text-lg"}
                          >
                            Job Title
                          </Label>
                          <input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`experience[${index}].jobName`)}
                            id={`experience[${index}].jobName`}
                            name={`experience[${index}].jobName`}
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                          <Label
                            htmlFor={`experience[${index}].responsibilities`}
                            className={"text-lg"}
                          >
                            Responsibilities
                          </Label>
                          <Textarea
                            className="p-2 border box-border w-full rounded-md text-lg"
                            {...register(
                              `experience[${index}].responsibilities`
                            )}
                            id={`experience[${index}].responsibilities`}
                            name={`experience[${index}].responsibilities`}
                            placeholder="e.g. Managed a team of developers"
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                          <Label
                            htmlFor={`experience[${index}].techStack`}
                            className={"text-lg"}
                          >
                            Tech Stack
                          </Label>
                          <Input
                            className="p-2 border box-border w-full rounded-md text-lg"
                            type="text"
                            {...register(`experience[${index}].techStack`)}
                            id={`experience[${index}].techStack`}
                            name={`experience[${index}].techStack`}
                            placeholder="e.g. React, Node.js"
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full ">
                          <Label
                            htmlFor={`experience[${index}].startDate`}
                            className="text-lg"
                          >
                            Start Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watch(`experience[${index}].startDate`) ? (
                                  format(
                                    new Date(
                                      watch(`experience[${index}].startDate`)
                                    ),
                                    "PPP"
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  watch(`experience[${index}].startDate`)
                                    ? new Date(
                                        watch(`experience[${index}].startDate`)
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setValue(
                                    `experience[${index}].startDate`,
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <input
                            type="hidden"
                            {...register(`experience[${index}].startDate`, {
                              required: "Start date is required",
                            })}
                            id={`experience[${index}].startDate`}
                            name={`experience[${index}].startDate`}
                          />
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                          <Label
                            htmlFor={`experience[${index}].endDate`}
                            className="text-lg"
                          >
                            End Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watch(`experience[${index}].endDate`) ? (
                                  format(
                                    new Date(
                                      watch(`experience[${index}].endDate`)
                                    ),
                                    "PPP"
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  watch(`experience[${index}].endDate`)
                                    ? new Date(
                                        watch(`experience[${index}].endDate`)
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setValue(
                                    `experience[${index}].endDate`,
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <input
                            type="hidden"
                            {...register(`experience[${index}].endDate`, {
                              required: "End date is required",
                            })}
                            id={`experience[${index}].endDate`}
                            name={`experience[${index}].endDate`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6 items-center justify-center">
                        <Button
                          className=" mr-2 text-2xl"
                          variant="destructive"
                          onClick={() => removeExperience(index)}
                        >
                          -
                        </Button>
                        <Button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveExperience(index, index - 1)}
                          variant=""
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          disabled={index === experienceFields.length - 1}
                          onClick={() => moveExperience(index, index + 1)}
                          variant=""
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() =>
                  appendExperience({
                    jobName: "",
                    orgName: "",
                    responsibilities: "",
                    techStack: "",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                Experience +
              </Button>
            </div>
            {/* socials */}
            <div className="space-y-4 flex flex-col items-center">
              <Label className={"text-xl font-bold"}>Socials</Label>
              <div className="w-full flex flex-col gap-6">
                {socialFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-end w-full">
                    <div className="flex flex-col w-1/2 gap-4">
                      <Label htmlFor={`socials[${idx}].name`}>Name</Label>
                      <Input
                        {...register(`socials.${idx}.name`, {
                          required: "Social name is required",
                        })}
                        id={`socials[${idx}].name`}
                        placeholder="e.g. LinkedIn"
                      />
                    </div>
                    <div className="flex flex-col w-1/2 gap-4">
                      <Label htmlFor={`socials[${idx}].url`}>URL</Label>
                      <Input
                        {...register(`socials.${idx}.url`, {
                          required: "URL is required",
                        })}
                        id={`socials[${idx}].url`}
                        placeholder="e.g. https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSocial(idx)}
                    >
                      &minus;
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant=""
                onClick={() => appendSocial({ name: "", url: "" })}
              >
                Add Social +
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
