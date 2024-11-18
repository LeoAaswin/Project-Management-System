"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { KanbanIcon, Plus, PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { CreateDocumentDialog } from "@/components/dashboard/create-document-dialog";
import { set } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  progress: string;
  due_date: string;
  assignees?: User[];
}

interface Document {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  author: User;
}

interface User {
  id: number;
  name: string;
  imageUrl?: string;
}

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceDescription, setWorkspaceDescription] = useState<string>("");
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isCreateDocumentDialogOpen, setIsCreateDocumentDialogOpen] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceDetails();
    }
  }, [workspaceId]);

  const fetchWorkspaceDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      setWorkspaceName(data.name);
      setWorkspaceDescription(data.description);
      setTasks(data.Tasks || []);
      setDocuments(data.Documents || []);
      setUsers(data.assignees || []);
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    }
  };

  const progressColor = (progress: string) => {
    switch (progress.toLowerCase()) {
      case "completed":
        return "bg-green-500 text-white";
      case "in progress":
        return "bg-orange-500 text-white";
      case "review":
        return "bg-orangered-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const priorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-green-500 text-white";
      case 2:
        return "bg-yellow-500 text-white";
      case 3:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{workspaceName}</h1>
        <div className="gap-4 flex">
          <Button variant="outline" onClick={() => setIsCreateTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Create Task
          </Button>
          <Button variant="outline" onClick={() => setIsCreateDocumentDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />Create Document
          </Button>
        </div>
      </div>
      <p className="text-lg text-gray-500 dark:text-gray-400">{workspaceDescription}</p>
      
      {tasks.length > 0 && (
        <section>
          <div className="flex gap-4 items-center mb-3">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button variant="outline">
              <KanbanIcon className="mr-2 h-4 w-4" />Kanban Board
            </Button>
          </div>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md shadow-sm dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-2 mt-2">
                      <TooltipProvider>
                        {task.assignees.slice(0, 4).map((assignee, index) => (
                          <Tooltip key={assignee.id}>
                            <TooltipTrigger asChild>
                              <div
                                className={`${getAvatarColor(assignee.name)} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800`}
                              >
                                {getInitials(assignee.name)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{assignee.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {task.assignees.length > 4 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 border-white dark:border-gray-800">
                                +{task.assignees.length - 4}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{task.assignees.slice(4).map(a => a.name).join(', ')}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TooltipProvider>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Due: {formatDate(task.due_date)}
                </p>

                <div
                  className={`ml-4 px-3 py-1 text-xs rounded-full ${progressColor(
                    task.progress
                  )}`}
                >
                  {task.progress}
                </div>
                <div
                  className={`ml-4 px-3 py-1 text-xs rounded-full ${priorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority === 1
                    ? "Low"
                    : task.priority === 2
                    ? "Medium"
                    : "High"}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

{documents.length > 0 && (
        <section>
          <div className="flex gap-4 items-center mb-3">
            <h2 className="text-xl font-semibold">Documents</h2>
          </div>
          <ul className="space-y-4">
            {documents.map((document) => (
              <li
                key={document.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md shadow-sm dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{document.title}</h3>
                  <div className="flex items-center mt-2">
                    {document.author ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`${getAvatarColor(document.author.name)} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800`}
                            >
                              {getInitials(document.author.name)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{document.author.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 border-white dark:border-gray-800">
                        ?
                      </div>
                    )}
                    <span className="ml-2 text-sm text-gray-500">
                      {document.author ? 'Author' : 'No author'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Created: {formatDate(document.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      
      <CreateTaskDialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
        onTaskCreated={fetchWorkspaceDetails}
        workspaceId={workspaceId as string}
      />

      <CreateDocumentDialog
        open={isCreateDocumentDialogOpen}
        onOpenChange={setIsCreateDocumentDialogOpen}
        onDocumentCreated={fetchWorkspaceDetails}
        workspaceId={workspaceId as string}
      />
    </div>
  );
}