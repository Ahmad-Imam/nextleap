import { DashboardSidebar } from "./_components/DashboardSidebar";

export default async function DashboardShellLayout({ children }) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="min-h-screen bg-blue-500 flex max-w-full w-full ">
        {/* xl:w-6xl lg:w-4xl md:w-3xl sm:w-xl */}
        {/* <p>layoutttttttttttttttt</p> */}
        <DashboardSidebar className={"bg-amber-400"}>
          {children}
        </DashboardSidebar>
      </div>
    </div>
  );
}
