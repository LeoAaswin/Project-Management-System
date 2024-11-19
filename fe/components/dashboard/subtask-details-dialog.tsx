"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { User, ChevronsUpDown } from "lucide-react";

interface User {
    id: number;
    name: string;
  }
interface SubtaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtask: {
    title: string;
    description?: string;
    priority?: string;
    progress?: string;
    dueDate?: string;
    assignee?: User;
  };
  onUpdateSubtask: (updatedSubtask: any) => void;
  users: User[];
}

export function SubtaskDetailsDialog({
  open,
  onOpenChange,
  subtask,
  onUpdateSubtask,
  users
}: SubtaskDetailsDialogProps) {
  const [title, setTitle] = useState(subtask.title);
  const [description, setDescription] = useState(subtask.description || "");
  const [priority, setPriority] = useState(subtask.priority || "1");
  const [progress, setProgress] = useState(subtask.progress || "To Do");
  const [dueDate, setDueDate] = useState(subtask.dueDate || "");
  const [assignee, setAssignee] = useState<User | undefined>(subtask.assignee);
  const [openCombobox, setOpenCombobox] = useState(false);

  const handleSubmit = () => {
    const updatedSubtask = {
      title,
      description,
      priority,
      progress,
      dueDate,
      assignee
    };
    onUpdateSubtask(updatedSubtask);
    onOpenChange(false);
  };

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
          <DialogTitle>Subtask Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subtask-title">Title</Label>
            <Input
              id="subtask-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtask-description">Description</Label>
            <Textarea
              id="subtask-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
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
              <Label>Progress</Label>
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
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {assignee 
                      ? assignee.name 
                      : "Select assignee"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[400px] p-0">
                <Command>
                  <CommandEmpty>No team members found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          setAssignee(user);
                          setOpenCombobox(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {getInitials(user.name)}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Subtask
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}