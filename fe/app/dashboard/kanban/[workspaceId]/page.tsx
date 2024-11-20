'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CreateTaskDialog } from '@/components/dashboard/create-task-dialog';
import { EditTaskDialog } from '@/components/dashboard/edit-task-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  progress: string;
  due_date: string;
  assignees?: User[];
  Subtasks?: Task[];
}

interface User {
  id: number;
  name: string;
  imageUrl?: string;
}

interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  status: string[];
  tasks: Task[];
}

const KanbanBoard = () => {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen]=useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [workspaceId]);

  useEffect(() => {
    const newColumns = [
      {
        id: 'todo',
        title: 'To Do',
        icon: <Clock className="text-blue-500" />,
        color: 'border-blue-500',
        status: ['todo', 'to do', 'to-do'],
        tasks: tasks.filter(task => 
          task.progress?.toLowerCase().replace(/[^a-z0-9]/g, '') === 'todo'
        )
      },
      {
        id: 'inprogress',
        title: 'In Progress',
        icon: <AlertCircle className="text-yellow-500" />,
        color: 'border-yellow-500',
        status: ['in progress', 'inprogress'],
        tasks: tasks.filter(task => 
          task.progress?.toLowerCase().replace(/[^a-z0-9]/g, '') === 'inprogress'
        )
      },
      {
        id: 'review',
        title: 'Review',
        icon: <Clock className="text-purple-500" />,
        color: 'border-purple-500',
        status: ['review', 'in review', 'inreview'],
        tasks: tasks.filter(task => 
          task.progress?.toLowerCase().includes('review')
        )
      },
      {
        id: 'completed',
        title: 'Completed',
        icon: <CheckCircle className="text-green-500" />,
        color: 'border-green-500',
        status: ['completed', 'done'],
        tasks: tasks.filter(task => 
          task.progress?.toLowerCase().replace(/[^a-z0-9]/g, '') === 'completed'
        )
      }
    ];
    setColumns(newColumns);
  }, [tasks]);

  const fetchTasks = async () => {
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
      setTasks(data.Tasks || []);
      setWorkspaceName(data.name);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
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

  const priorityBadge = (priority: number) => {
    switch (priority) {
      case 1: return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Low</span>;
      case 2: return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>;
      case 3: return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High</span>;
      default: return null;
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t.id.toString() === draggableId);
    if (!task) return;

    const newStatus = columns.find(col => col.id === destination.droppableId)?.title || '';
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...task,
          progress: newStatus
        })
      });

      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id.toString() === draggableId 
            ? { ...t, progress: newStatus }
            : t
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading Tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{workspaceName}</h1>
            <p className="text-gray-500">Manage your tasks efficiently</p>
          </div><Button 
            variant="outline" 
            onClick={() => setIsCreateTaskDialogOpen(true)}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>

          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">No Tasks Found</h2>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-6">
              {columns.map((column) => (
                <div 
                  key={column.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 flex items-center border-b border-gray-100">
                    {column.icon}
                    <h2 className="ml-2 font-semibold text-lg text-gray-700">
                      {column.title} ({column.tasks.length})
                    </h2>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`p-3 space-y-4 min-h-[400px] ${
                          snapshot.isDraggingOver ? 'bg-gray-50' : ''
                        }`}
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                              onClick={() => {setSelectedTask(task); setIsEditTaskDialogOpen(true) } }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  bg-white border-l-4 ${column.color} 
                                  rounded-lg p-4 shadow-md 
                                  hover:shadow-lg transition-all 
                                  transform hover:-translate-y-1
                                  ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                                `}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                  {priorityBadge(task.priority)}
                                </div>
                                {task.due_date && (
                                  <p className="text-sm text-gray-500 mb-2">
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </p>
                                )}
                                <div className="flex justify-between items-center">
                                  {task.assignees && task.assignees.length > 0 && (
                                    <div className="flex -space-x-2">
                                      <TooltipProvider>
                                        {task.assignees.slice(0, 3).map((assignee) => (
                                          <Tooltip key={assignee.id}>
                                            <TooltipTrigger asChild>
                                              <div
                                                className={`${getAvatarColor(assignee.name)} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                                              >
                                                {getInitials(assignee.name)}
                                              </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{assignee.name}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        ))}
                                        {task.assignees.length > 3 && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                                                +{task.assignees.length - 3}
                                              </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{task.assignees.slice(3).map(a => a.name).join(', ')}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </TooltipProvider>
                                    </div>
                                  )}
                                  {task.Subtasks && task.Subtasks.length > 0 && (
                                    <div className="text-sm text-gray-500">
                                      Subtasks: {task.Subtasks.length}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
      <CreateTaskDialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
        onTaskCreated={fetchTasks}
        workspaceId={workspaceId as string}
      />
      <EditTaskDialog
        open={isEditTaskDialogOpen}
        onOpenChange={setIsEditTaskDialogOpen}
        onTaskUpdated={fetchTasks}
        data={selectedTask}
        workspaceId={workspaceId as string}
        />
    </div>
  );
};

export default KanbanBoard;