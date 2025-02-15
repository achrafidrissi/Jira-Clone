import AIInterface from "@/components/AIComponent";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";

const WorkspaceIdPage = async ( ) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
  <div className="">
    <WorkspaceIdClient />
    <AIInterface />
  </div>
  )
};

export default WorkspaceIdPage;
