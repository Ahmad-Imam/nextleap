import React from "react";
import ProfileForm from "./_components/ProfileForm";
import { getUser } from "@/actions/user";

export default async function ProfilePage() {
  const loggedUser = await getUser();
  return (
    <div>
      <ProfileForm loggedUser={loggedUser} />
    </div>
  );
}
