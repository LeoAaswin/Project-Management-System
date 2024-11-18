"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { CreateWorkspaceDialog } from '@/components/dashboard/create-workspace-dialog';
import { EditWorkspaceDialog } from '@/components/dashboard/edit-workspace-dialog';
import Link from 'next/link';

interface Workspace {
  id: string;
  name: string;
  description: string;
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu) {
        const menuElement = menuRef.current;
        const buttonElement = buttonRefs.current[openMenu];
        
        if (!menuElement?.contains(event.target as Node) && 
            !buttonElement?.contains(event.target as Node)) {
          setOpenMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setWorkspaces(data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsEditDialogOpen(true);
    setOpenMenu(null);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setWorkspaces(workspaces.filter((workspace) => workspace.id !== workspaceId));
      } else {
        console.error('Failed to delete workspace');
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
    setOpenMenu(null);
  };

  const toggleMenu = (workspaceId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenu(openMenu === workspaceId ? null : workspaceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="relative">
            <Link href={`/dashboard/workspace/${workspace.id}`}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {workspace.description}
                </p>
              </CardContent>
            </Link>

            <div className="absolute top-2 right-2">
              <button
                ref={(el) => (buttonRefs.current[workspace.id] = el)}
                onClick={(e) => toggleMenu(workspace.id, e)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              
              {openMenu === workspace.id && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50"
                >
                  <button
                    onClick={() => handleEditWorkspace(workspace)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorkspace(workspace.id)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <CreateWorkspaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onWorkspaceCreated={fetchWorkspaces}
      />

      <EditWorkspaceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onWorkspaceUpdated={fetchWorkspaces}
        workspace={selectedWorkspace}
      />
    </div>
  );
}