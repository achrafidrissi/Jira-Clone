import AIInterface from "@/components/AIComponent";
import { getCurrent } from "@/features/auth/action";
import { redirect } from "next/navigation";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
    if (!user) redirect("/sign-in");

    return (
      <div className="p-6">
        <AIInterface />
      </div>
    );
  };
  
  export default WorkspaceIdPage;