import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  timezone: string | null;
  language: string | null;
  theme: string | null;
  student_id?: string | null;
  teacher_id?: string | null;
  grade_level?: string | null;
  subject_specialization?: string | null;
  academic_year?: string | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Ensure all required fields are present with defaults
      const profileData: UserProfile = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        avatar_url: data.avatar_url,
        phone: data.phone,
        job_title: data.job_title,
        department: data.department,
        timezone: data.timezone,
        language: data.language,
        theme: data.theme,
        student_id: (data as any).student_id || null,
        teacher_id: (data as any).teacher_id || null,
        grade_level: (data as any).grade_level || null,
        subject_specialization: (data as any).subject_specialization || null,
        academic_year: (data as any).academic_year || null,
        status: (data as any).status || null,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email for verification.",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        toast({
          title: "Error signing in with Google",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        toast({
          title: "Error sending reset email",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
  };
};
