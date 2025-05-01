"use client";
// import { onboardingSchema } from "@/lib/schema";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { updateUserOnboard } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TestTimeout = async () => {
  console.log("TestTimeout called");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 2000); // 2 seconds delay
  });
};

export default function OnboardingForm({ industries }) {
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const router = useRouter();
  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUserOnboard);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    // resolver: zodResolver(onboardingSchema),
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
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    name: "socials",
    control,
  });

  const onSubmit = async (values) => {
    try {
      if (!values.socials || values.socials.length === 0) {
        toast.error("Please add at least one social link.");
        return;
      }
      if (!values.skills || values.skills.length === 0) {
        toast.error("Please add at least one social link.");
        return;
      }

      await updateUserFn({
        ...values,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully!");
      router.push("/");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  return (
    <div className="flex items-center justify-center bg-background w-2xl">
      <Card className="w-full max-w-3xl md:max-w-4xl my-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription className={"text-lg"}>
            Select your skills to get personalized cover letters and resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="space-y-2 flex flex-col items-center justify-center py-2">
              {skillFields.map((field, index) => {
                return (
                  <div
                    className="flex justify-between items-center w-full gap-2"
                    key={field.id}
                  >
                    <div className="flex flex-col space-y-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ">
                      <Label
                        htmlFor={`skills[${index}].name`}
                        className={"text-lg"}
                      >
                        Skill Name
                      </Label>
                      <input
                        className="p-2 border box-border w-full rounded-md text-lg"
                        type="text"
                        {...register(`skills[${index}].name`, {
                          required: "Skills name is required",
                        })}
                        id={`skills[${index}].name`}
                        name={`skills[${index}].name`}
                      />
                    </div>
                    <div className="flex flex-col  space-y-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ">
                      <Label
                        htmlFor={`skills[${index}].exp`}
                        className={"text-lg"}
                      >
                        Experience Year
                      </Label>
                      <input
                        className="p-2 border box-border w-full rounded-md text-lg"
                        type="number"
                        {...register(`skills[${index}].exp`)}
                        id={`skills[${index}].exp`}
                        name={`skills[${index}].exp`}
                      />
                    </div>

                    <div className=" flex flex-col justify-start items-center space-y-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                      <Label
                        htmlFor={`skills[${index}].level`}
                        className={"text-lg"}
                      >
                        Level
                      </Label>
                      <Select
                        defaultValue={setValue(
                          `skills[${index}].level`,
                          skillLevels[0]
                        )}
                        onValueChange={(value) =>
                          setValue(`skills[${index}].level`, value)
                        }
                      >
                        <SelectTrigger
                          id={`skills[${index}].level`}
                          className={"text-lg"}
                        >
                          <SelectValue placeholder={`${skillLevels[0]}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Skill Level</SelectLabel>
                            {skillLevels.map((lev) => (
                              <SelectItem
                                key={lev}
                                value={lev}
                                className={"text-lg"}
                              >
                                {lev}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* {errors.subIndustry && (
                        <p className="text-sm text-red-500">
                          {errors.subIndustry.message}
                        </p>
                      )} */}
                    </div>

                    <Button
                      className="mt-6 mr-2 text-2xl"
                      onClick={() => removeSkill(index)}
                    >
                      &#8722;
                    </Button>
                  </div>
                );
              })}

              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() =>
                  appendSkill({ name: "", exp: 0, level: skillLevels[0] })
                }
              >
                Skills +
              </Button>
            </div>

            <div className="space-y-2 flex flex-col items-center justify-center  py-2">
              {socialFields.map((field, index) => {
                return (
                  <div
                    className="flex justify-between items-center w-max gap-4"
                    key={field.id}
                  >
                    <div className="flex flex-col w-1/2 space-y-2">
                      <Label htmlFor={`socials[${index}].name`}>
                        Social Name
                      </Label>
                      <input
                        className="p-2 border box-border w-full rounded-md"
                        type="text"
                        {...register(`socials[${index}].name`, {
                          required: "Social name is required",
                        })}
                        id={`socials[${index}].name`}
                        name={`socials[${index}].name`}
                      />
                    </div>
                    <div className="flex flex-col w-1/2 space-y-2">
                      <Label htmlFor={`socials[${index}].url`}>URL</Label>
                      <input
                        className="p-2 border box-border w-full rounded-md"
                        type="text"
                        {...register(`socials[${index}].url`)}
                        id={`socials[${index}].url`}
                        name={`socials[${index}].url`}
                      />
                    </div>
                    <Button
                      className="mt-4 mr-2 text-2xl"
                      onClick={() => removeSocial(index)}
                    >
                      &#8722;
                    </Button>
                  </div>
                );
              })}

              <Button
                className="my-4 text-md cursor-pointer border rounded-lg p-4"
                onClick={() => appendSocial({ name: "", url: "" })}
              >
                Social Links +
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
