import { DashboardSidebar } from "./_components/DashboardSidebar";

export default async function DashboardShellLayout({ children }) {
  return (
    <div className="w-full min-h-screen">
      {/* xl:w-6xl lg:w-4xl md:w-3xl sm:w-xl */}
      {/* <p>layoutttttttttttttttt</p> */}
      <DashboardSidebar className={""}>{children}</DashboardSidebar>
    </div>
  );
}
