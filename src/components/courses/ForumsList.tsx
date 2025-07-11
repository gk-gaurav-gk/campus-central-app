import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Plus, Lock, Pin, Reply, ThumbsUp, Calendar, User } from 'lucide-react';

interface Forum {
  id: string;
  title: string;
  description?: string;
  is_locked: boolean;
  created_at: string;
  course_title?: string;
  posts_count: number;
}

interface ForumPost {
  id: string;
  title?: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  likes_count: number;
  replies_count: number;
  created_at: string;
  author_name?: string;
  parent_id?: string;
}

const ForumsList = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    if (selectedForum) {
      fetchPosts(selectedForum.id);
    }
  }, [selectedForum]);

  const fetchForums = async () => {
    try {
      const { data, error } = await supabase
        .from('forums')
        .select(`
          *,
          courses(title),
          forum_posts(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const forumsWithCounts = data?.map(forum => ({
        ...forum,
        course_title: forum.courses?.title || 'General',
        posts_count: forum.forum_posts?.length || 0,
      })) || [];

      setForums(forumsWithCounts);
    } catch (error) {
      console.error('Error fetching forums:', error);
      toast({
        title: 'Error',
        description: 'Failed to load forums',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (forumId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles!forum_posts_author_id_fkey(first_name, last_name)
        `)
        .eq('forum_id', forumId)
        .is('parent_id', null) // Only get top-level posts
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithAuthor = data?.map(post => ({
        ...post,
        author_name: post.profiles 
          ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim()
          : 'Unknown',
      })) || [];

      setPosts(postsWithAuthor);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePost = async () => {
    if (!selectedForum || !postFormData.title.trim() || !postFormData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          forum_id: selectedForum.id,
          title: postFormData.title,
          content: postFormData.content,
          author_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Post created successfully',
      });

      setIsCreatePostOpen(false);
      setPostFormData({ title: '', content: '' });
      fetchPosts(selectedForum.id);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    // In a real implementation, you'd track user likes and update accordingly
    toast({
      title: 'Feature Coming Soon',
      description: 'Like functionality will be implemented soon',
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Forums List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Course Forums
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forums.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No forums available</p>
              </div>
            ) : (
              forums.map((forum) => (
                <Card 
                  key={forum.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedForum?.id === forum.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedForum(forum)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{forum.title}</h4>
                          {forum.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {forum.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs">
                            {forum.course_title}
                          </Badge>
                          <span className="text-muted-foreground">
                            {forum.posts_count} posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forum Posts */}
      <div className="lg:col-span-2">
        {selectedForum ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {selectedForum.title}
                  {selectedForum.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedForum.description}
                </p>
              </div>
              {!selectedForum.is_locked && (
                <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={postFormData.title}
                          onChange={(e) => setPostFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter post title"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          value={postFormData.content}
                          onChange={(e) => setPostFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter post content"
                          rows={6}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreatePost} className="flex-1">
                          Create Post
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to start a discussion in this forum.
                  </p>
                  {!selectedForum.is_locked && (
                    <Button onClick={() => setIsCreatePostOpen(true)}>
                      Create First Post
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className={`${post.is_pinned ? 'border-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {post.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                              {post.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                              <h4 className="font-medium">{post.title}</h4>
                            </div>
                            
                            <p className="text-foreground mb-3 whitespace-pre-wrap">
                              {post.content}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Reply className="w-3 h-3" />
                                {post.replies_count} replies
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Reply className="w-4 h-4" />
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a Forum</h3>
              <p className="text-muted-foreground">
                Choose a forum from the left to view discussions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForumsList;