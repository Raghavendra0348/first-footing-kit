import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_name: string;
  user_email?: string;
}

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = useCallback(async (reportId: string) => {
    try {
      setLoading(true);
      
      // Get report with public notes (using as comments)
      const { data: report, error } = await supabase
        .from('civic_reports')
        .select('public_notes')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      // Convert public notes to comments format  
      const notes = Array.isArray(report?.public_notes) ? report.public_notes : [];
      const formattedComments = notes.map((note: string, index: number) => ({
        id: `${reportId}-${index}`,
        content: note,
        created_at: new Date().toISOString(),
        user_name: 'Citizen'
      }));

      setComments(formattedComments);
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to load comments: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addComment = useCallback(async (reportId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment on reports.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Invalid Comment",
        description: "Comment cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Get current public notes
      const { data: report, error: fetchError } = await supabase
        .from('civic_reports')
        .select('public_notes')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      const currentNotes = Array.isArray(report?.public_notes) ? report.public_notes : [];
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous';
      const newNote = `${userName}: ${content.trim()}`;
      const updatedNotes = [...currentNotes, newNote];

      // Update report with new note
      const { error: updateError } = await supabase
        .from('civic_reports')
        .update({ public_notes: updatedNotes as any })
        .eq('id', reportId);

      if (updateError) throw updateError;

      // Add to local state
      const newComment: Comment = {
        id: `${reportId}-${currentNotes.length}`,
        content: content.trim(),
        created_at: new Date().toISOString(),
        user_name: userName,
        user_email: user.email
      };

      setComments(prev => [newComment, ...prev]);

      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add comment: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const deleteComment = useCallback(async (commentId: string) => {
    // For now, just show a message that this feature needs implementation
    toast({
      title: "Feature Not Available",
      description: "Comment deletion requires additional database setup.",
    });
  }, [toast]);

  return {
    comments,
    loading,
    fetchComments,
    addComment,
    deleteComment
  };
};