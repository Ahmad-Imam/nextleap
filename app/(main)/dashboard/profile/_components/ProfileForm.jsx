"use client";

import { updateUser } from "@/actions/user";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function ProfileForm({ loggedUser }) {
  const router = useRouter();

  const defaultValues = {
    bio: loggedUser.bio || "",
    socials: loggedUser.socials?.length
      ? loggedUser.socials
      : [{ name: "", url: "" }],
    skills: loggedUser.skills?.length
      ? loggedUser.skills
      : [{ name: "", exp: "", level: skillLevels[0] }],
    education: loggedUser.education?.length ? loggedUser.education : [],
    experience: loggedUser.experience?.length ? loggedUser.experience : [],
    proj: loggedUser.proj?.length ? loggedUser.proj : [],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues,
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    name: "education",
    control,
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
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
  } = useFieldArray({
    name: "proj",
    control,
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    name: "skills",
    control,
  });

  const {
    loading: updateLoading,
    fn: updateFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUser);

  const onSubmit = async (data) => {
    if (!data.socials || data.socials.length === 0) {
      toast.error("Please add at least one social link.");
      return;
    }
    if (!data.skills || data.skills.length === 0) {
      toast.error("Please add at least one social link.");
      return;
    }

    const newUser = await updateFn(data);
    if (updateError) {
      toast.error("Error updating profile: " + updateError.message);
      return;
    }
  };
  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  return (
    <Card className="w-full my-10 mx-6">
      <CardHeader>
        <CardTitle className="text-3xl">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col gap-2"
        >
          {/* Bio */}
          <div className="space-y-2">
            <Label className={"text-xl font-bold"} htmlFor="bio">
              Professional Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your professional background..."
              className="h-24"
              {...register("bio", { required: "Bio is required" })}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>

          {/* Socials */}
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

          {/* Skills */}
          <div className="space-y-4 flex flex-col items-center ">
            <Label className={"text-xl font-bold"}>Skills</Label>
            <div className="w-full flex flex-col gap-6">
              {skillFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-end justify-between w-full"
                >
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
                      value={field.level || ""}
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
                  <Button
                    type="button"
                    variant="destructive"
                    className=""
                    onClick={() => removeSkill(idx)}
                  >
                    &minus;
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant=""
              onClick={() =>
                appendSkill({ name: "", exp: "", level: skillLevels[0] })
              }
            >
              Add Skill +
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
                        <DatePicker
                          date={
                            watch(`education[${index}].startDate`)
                              ? new Date(watch(`education[${index}].startDate`))
                              : undefined
                          }
                          setDate={(date) =>
                            setValue(
                              `education[${index}].startDate`,
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                        />
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
                        <DatePicker
                          date={
                            watch(`education[${index}].endDate`)
                              ? new Date(watch(`education[${index}].endDate`))
                              : undefined
                          }
                          setDate={(date) =>
                            setValue(
                              `education[${index}].endDate`,
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                        />
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
                    <Button
                      className="mt-6 mr-2 text-2xl"
                      variant="destructive"
                      onClick={() => removeEducation(index)}
                    >
                      -
                    </Button>
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
                    <Button
                      className="mt-6 mr-2 text-2xl"
                      variant="destructive"
                      onClick={() => removeProjects(index)}
                    >
                      -
                    </Button>
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
                          {...register(`experience[${index}].responsibilities`)}
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
                        <DatePicker
                          date={
                            watch(`experience[${index}].startDate`)
                              ? new Date(
                                  watch(`experience[${index}].startDate`)
                                )
                              : undefined
                          }
                          setDate={(date) =>
                            setValue(
                              `experience[${index}].startDate`,
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                        />
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

                        <DatePicker
                          date={
                            watch(`experience[${index}].endDate`)
                              ? new Date(watch(`experience[${index}].endDate`))
                              : undefined
                          }
                          setDate={(date) =>
                            setValue(
                              `experience[${index}].startDate`,
                              date ? format(date, "endDate-MM-dd") : ""
                            )
                          }
                        />
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
                    <Button
                      className="mt-6 mr-2 text-2xl"
                      variant="destructive"
                      onClick={() => removeExperience(index)}
                    >
                      -
                    </Button>
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
          <Button type="submit" className="w-full" disabled={updateLoading}>
            {updateLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
