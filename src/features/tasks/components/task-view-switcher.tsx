"use client";

import { useCallback } from "react";
import { Loader, PlusIcon, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import AutoFill from "@/components/auto-fill";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetTasks } from "../api/use-get-tasks";
import { useBulkUpdateTask } from "../api/use-bulk-update-tasks";

import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";
import { DataFilters } from "./data-filters";
import { DataCalendar } from "./data-calendar";

import { TaskStatus } from "../types";
import { client } from "@/lib/rpc";

interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter}: TaskViewSwitcherProps) => {
    const [{
            status,
            assigneeId,
            projectId,
            dueDate
        }] = useTaskFilters();
    const [view, setView] = useQueryState("task-view", {
        defaultValue: "table",
    });

    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();
    const { open } = useCreateTaskModal();

    const { mutate: bulkUpdate} = useBulkUpdateTask();

    const { 
        data: tasks,
        isLoading: isLoadingTasks, 
        refetch: refetchTasks
    } = useGetTasks({ 
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate,
    });

    const onKanbanChange = useCallback((
        tasks: { $id: string; status: TaskStatus; position: number } []
    ) => {
        bulkUpdate({
            json: { tasks },
        })
    }, [bulkUpdate]);

    if (!paramProjectId) {
        console.log("No project selected")
    }


    // const handleAutoFill = async () => {
    //     try {

            

    //         // Fetch members from the API
    //         const response = await client.api.members.$get({ query: { workspaceId } });

    //         if (!response.ok) {
    //             throw new Error("Failed to fetch members");
    //         }

    //         const data = await response.json();
    //         const members = data.data.documents;

    //         // Map over members instead of tasks
    //         const assigneesWithDetails = members.map(member => ({
    //             id: member.userId,
    //             description: member.description || "No description available"
    //         }));

    //         // Construct payload
    //         const payload = {
    //             workspaceId,
    //             projectId: paramProjectId || projectId,
    //             assignees: assigneesWithDetails
    //         };

    //         // Send data
    //         const apiResponse = await fetch('', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!apiResponse.ok) {
    //             throw new Error("Failed to send data to the external API");
    //         }

    //         console.log("Retrieved data:", payload);
    //     } catch (error) {
    //         console.error("Error in handleAutoFill:", error);
    //     }
    // };

    const handleAutoFill = async () => {
        try {
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

            // Fetch members from the API
            const membersResponse = await client.api.members.$get({ query: { workspaceId } });

            if (!membersResponse.ok) {
                throw new Error("Failed to fetch members");
            }

            const membersData = await membersResponse.json();
            const members = membersData.data.documents;

            // Map over members instead of tasks
            const assigneesWithDetails = members.map(member => ({
                id: member.userId,
                description: member.description || "No description available"
            }));

            // Construct payload
            const payload = {
                workspaceId,
                projectId: paramProjectId || projectId,
                projectDescription,  
                assignees: assigneesWithDetails
            };

            // Send data
            const apiResponse = await fetch('', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!apiResponse.ok) {
                throw new Error("Failed to send data to Ollama API");
            }

            await refetchTasks();

            console.log("Retrieved data:", payload);
        } catch (error) {
            console.error("Error in handleAutoFill:", error);
        }
    };
        
    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger 
                            className="h-8 w-full lg:w-auto"
                            value="table"
                        >
                            Table
                        </TabsTrigger>
                        <TabsTrigger 
                            className="h-8 w-full lg:w-auto"
                            value="kanban"
                        >
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger 
                            className="h-8 w-full lg:w-auto"
                            value="calendar"
                        >
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex justify-between">
                        <Button
                            onClick={open}
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            <PlusIcon className="size-4 mr-2"/>
                            New
                        </Button>
                        <AutoFill />
                    </div>
                </div>
                <DottedSeparator className="my-4"/>
                    <DataFilters hideProjectFilter={ hideProjectFilter } />
                <DottedSeparator className="my-4"/>
                {isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                <>
                    <TabsContent value="table" className="mt-0">
                        <DataTable columns={columns} data={tasks?.documents ?? []} />
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        <DataKanban onChange={onKanbanChange} data= {tasks?.documents ?? []} />                       
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0 h-full pb-4">
                        <DataCalendar data={tasks?.documents ?? []} />
                    </TabsContent>
                </>
                )}
            </div>
        </Tabs>
    )
} 