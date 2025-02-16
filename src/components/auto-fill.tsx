import axios from "axios";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { client } from "@/lib/rpc";

import { Button } from "@/components/ui/button";

import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

// Define the interfaces
interface Assignee {
  id: string;
  description: string;
}

interface Task {
  assigneeId: string;
  description: string;
  dueDate: string;
  name: string;
  position: number;
  projectId: string;
  status: string;
  workspaceId: string;
}

interface OllamaRequest {
  assignees: Assignee[];
  projectId: string | null;
  workspaceId: string;
  projectDescription: string;
}

interface OllamaResponse {
  tasks: Task[];
}

export default function AutoFill() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [{
    status,
    assigneeId,
    projectId,
    dueDate
  }] = useTaskFilters();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const handleAutoFill = async () => {
    setLoading(true);
    setError(null);

    const projectIdToUse = paramProjectId ?? projectId;

    if (!projectIdToUse) {
        throw new Error("Project ID is required but was not provided.");
    }

    const projectResponse = await client.api.projects[":projectId"].$get({
        param: { projectId: projectIdToUse },
    });

    if (!projectResponse.ok) {
        throw new Error("Failed to fetch project details");
    }

    const projectData = await projectResponse.json();
    const projectDescription = projectData.data?.description || "No description available";

    // Example data to send to the Ollama server
    const membersResponse = await client.api.members.$get({ query: { workspaceId: workspaceId } });

    if (!membersResponse.ok) {
        throw new Error("Failed to fetch members");
    }

    const membersData = await membersResponse.json();
    const members = membersData.data.documents;

    // Map over members to create assignees
    const assigneesWithDetails = members.map((member) => ({
        id: member.userId,
        description: member.description || "No description available",
    }));

    // Construct the payload dynamically
    const payload: OllamaRequest = {
        assignees: assigneesWithDetails,
        projectId: paramProjectId || projectId, // Replace with dynamic project ID if needed
        workspaceId, // Replace with dynamic workspace ID if needed
        projectDescription, // Replace with dynamic description if needed
    };

    

    try {
      const response = await axios.post<OllamaResponse>(
        "http://100.71.2.111:5000/ai-task",
        payload
      );

      if (response.status === 200) {
        console.log("Tasks generated successfully:", response.data.tasks);
        setTasks(response.data.tasks); 
        setError(null);
      } else {
        throw new Error("Failed to generate tasks.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to generate tasks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleAutoFill}
        variant="secondary"
        size="sm"
        className="w-full lg:w-auto"
        disabled={loading}
      >
        <Sparkles className="size-4 mr-2" />
        {loading ? "Generating tasks..." : "Auto Fill"}
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {tasks && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Generated Tasks</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {JSON.stringify(tasks, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}