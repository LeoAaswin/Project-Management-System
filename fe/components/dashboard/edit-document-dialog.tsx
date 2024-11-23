"use client";

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUpdated: () => void;
  data: {
    id: number;
    title: string;
    description: string;
    author: [];
    createdAt: string;
    updatedAt: string;
  };
  workspaceId: string;
}

export function EditDocumentDialog({
  open,
  onOpenChange,
  onDocumentUpdated,
  data,
  workspaceId,
}: EditDocumentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title, 
          description, 
          WorkspaceId: parseInt(workspaceId) 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update document');
      }

      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });

      onDocumentUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!data?.id) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${data.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }

      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      
      onDocumentUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <h2 className="text-sm text-muted-foreground">Created by: {data?.author.name}</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !isFormValid}>
                {loading ? 'Updating...' : 'Update Document'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}