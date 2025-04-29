import { getUser } from "@/actions/user";
import ProfileForm from "./_components/ProfileForm";

export default async function ProfilePage() {
  const loggedUser = await getUser();
  return (
    <div className="p-4 mx-auto w-full">
      <ProfileForm loggedUser={loggedUser} />
    </div>
  );
}
