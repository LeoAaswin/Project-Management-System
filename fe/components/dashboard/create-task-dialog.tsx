"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { X, User, ChevronsUpDown, Plus, Trash2 } from "lucide-react";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
  workspaceId: string;
}

interface User {
  id: number;
  name: string;
}

interface Subtask {
  title: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
  workspaceId,
}: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("1");
  const [progress, setProgress] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
  
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddUser = (user: User) => {
    if (!assignedUsers.some((u) => u.id === user.id)) {
      setAssignedUsers([...assignedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", description: "" }]);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubtaskChange = (index: number, field: keyof Subtask, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      [field]: value,
    };
    setSubtasks(updatedSubtasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          priority: parseInt(priority),
          progress,
          due_date: dueDate,
          WorkspaceId: parseInt(workspaceId),
          assignees: assignedUsers.map((user) => user.id),
        }),
      });

      if (!taskRes.ok) {
        const errorData = await taskRes.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      const taskData = await taskRes.json();

      // Then create subtasks if any exist
      if (subtasks.length > 0) {
        await Promise.all(
          subtasks.map((subtask) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subtasks`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...subtask,
                TaskId: taskData.id,
              }),
            })
          )
        );
      }

      toast({
        title: "Success",
        description: "Task and subtasks created successfully",
      });

      onTaskCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("1");
    setProgress("todo");
    setDueDate("");
    setAssignedUsers([]);
    setSubtasks([]);
  };

  const isFormValid = title && dueDate && subtasks.every(st => st.title);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing Task Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress</Label>
              <Select value={progress} onValueChange={setProgress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Subtasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubtask}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subtask
              </Button>
            </div>
            <div className="space-y-3">
              {subtasks.map((subtask, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive/20"
                    onClick={() => handleRemoveSubtask(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={subtask.title}
                      onChange={(e) => handleSubtaskChange(index, "title", e.target.value)}
                      placeholder="Enter subtask title"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Assignees Section */}
          <div className="space-y-2">
            <Label>Assignees</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {assignedUsers.length === 0 
                      ? "Select team members" 
                      : `${assignedUsers.length} member${assignedUsers.length === 1 ? '' : 's'} selected`
                    }
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[400px] p-0">
                <Command>
                  <CommandEmpty>No team members found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {users.map((user) => {
                      const isSelected = assignedUsers.some(u => u.id === user.id);
                      return (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            if (isSelected) {
                              handleRemoveUser(user.id);
                            } else {
                              handleAddUser(user);
                            }
                          }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                              {getInitials(user.name)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                          {isSelected && <User className="h-4 w-4" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {assignedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignedUsers.map((user) => (
                  <Badge 
                    key={user.id} 
                    variant="secondary"
                    className="py-1 pl-2 pr-1 flex items-center gap-1"
                  >
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {getInitials(user.name)}
                    </div>
                    <span>{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/20"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}