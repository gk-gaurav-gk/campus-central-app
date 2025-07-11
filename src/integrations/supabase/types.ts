export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          id: string
          notes: string | null
          scheduled_at: string | null
          subject: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          subject: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          subject?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          attachments: Json | null
          author_id: string
          content: string
          course_id: string | null
          created_at: string
          expire_at: string | null
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          publish_at: string | null
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          content: string
          course_id?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          publish_at?: string | null
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          content?: string
          course_id?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          publish_at?: string | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_groups: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string
          description: string | null
          group_type: string
          id: string
          is_private: boolean | null
          max_members: number | null
          name: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          group_type: string
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          group_type?: string
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_groups_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          edited_at: string | null
          group_id: string
          id: string
          is_edited: boolean | null
          mentions: string[] | null
          message_type: string | null
          reply_to: string | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          edited_at?: string | null
          group_id: string
          id?: string
          is_edited?: boolean | null
          mentions?: string[] | null
          message_type?: string | null
          reply_to?: string | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          edited_at?: string | null
          group_id?: string
          id?: string
          is_edited?: boolean | null
          mentions?: string[] | null
          message_type?: string | null
          reply_to?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          employee_count: number | null
          founded_year: number | null
          funding_stage: string | null
          geography: string | null
          id: string
          industry: string | null
          last_funding_amount: number | null
          logo_url: string | null
          market_size: number | null
          name: string
          notes: string | null
          profit_growth: number | null
          status: string | null
          tags: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          funding_stage?: string | null
          geography?: string | null
          id: string
          industry?: string | null
          last_funding_amount?: number | null
          logo_url?: string | null
          market_size?: number | null
          name: string
          notes?: string | null
          profit_growth?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          funding_stage?: string | null
          geography?: string | null
          id?: string
          industry?: string | null
          last_funding_amount?: number | null
          logo_url?: string | null
          market_size?: number | null
          name?: string
          notes?: string | null
          profit_growth?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_audit_log: {
        Row: {
          action: string
          changed_by: string | null
          company_id: string | null
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "company_audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          linkedin_url: string | null
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrollment_date: string
          grade: string | null
          id: string
          status: string | null
          student_id: string
        }
        Insert: {
          course_id: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          status?: string | null
          student_id: string
        }
        Update: {
          course_id?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          academic_year: string | null
          course_code: string | null
          created_at: string
          credits: number | null
          department: string | null
          description: string | null
          id: string
          instructor_id: string | null
          is_active: boolean | null
          max_students: number | null
          semester: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          course_code?: string | null
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          instructor_id?: string | null
          is_active?: boolean | null
          max_students?: number | null
          semester?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          course_code?: string | null
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          instructor_id?: string | null
          is_active?: boolean | null
          max_students?: number | null
          semester?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          company_id: string | null
          created_at: string
          description: string | null
          expected_close_date: string | null
          id: string
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          end_time: string
          event_type: string
          id: string
          is_recurring: boolean | null
          is_virtual: boolean | null
          location: string | null
          max_attendees: number | null
          meeting_url: string | null
          organizer_id: string
          recurrence_pattern: Json | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          event_type: string
          id?: string
          is_recurring?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          organizer_id: string
          recurrence_pattern?: Json | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          organizer_id?: string
          recurrence_pattern?: Json | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          attachments: Json | null
          author_id: string
          content: string
          created_at: string
          forum_id: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          parent_id: string | null
          replies_count: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          content: string
          created_at?: string
          forum_id: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          replies_count?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          content?: string
          created_at?: string
          forum_id?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          replies_count?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_locked: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forums_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: number | null
          recipient_id: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: number | null
          recipient_id: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: number | null
          recipient_id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          job_title: string | null
          language: string | null
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          theme: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          language?: string | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          language?: string | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          option_image_url: string | null
          option_text: string | null
          order_index: number
          question_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_image_url?: string | null
          option_text?: string | null
          order_index: number
          question_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_image_url?: string | null
          option_text?: string | null
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_analytics: {
        Row: {
          average_score: number | null
          common_wrong_answers: Json | null
          difficulty_rating: number | null
          id: string
          question_id: string | null
          quiz_id: string
          total_attempts: number | null
          updated_at: string | null
        }
        Insert: {
          average_score?: number | null
          common_wrong_answers?: Json | null
          difficulty_rating?: number | null
          id?: string
          question_id?: string | null
          quiz_id: string
          total_attempts?: number | null
          updated_at?: string | null
        }
        Update: {
          average_score?: number | null
          common_wrong_answers?: Json | null
          difficulty_rating?: number | null
          id?: string
          question_id?: string | null
          quiz_id?: string
          total_attempts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_analytics_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_analytics_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          attempt_id: string
          audio_url: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          manual_feedback: string | null
          points_earned: number | null
          question_id: string
          ranking_order: number[] | null
          selected_options: string[] | null
          text_answer: string | null
        }
        Insert: {
          attempt_id: string
          audio_url?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          manual_feedback?: string | null
          points_earned?: number | null
          question_id: string
          ranking_order?: number[] | null
          selected_options?: string[] | null
          text_answer?: string | null
        }
        Update: {
          attempt_id?: string
          audio_url?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          manual_feedback?: string | null
          points_earned?: number | null
          question_id?: string
          ranking_order?: number[] | null
          selected_options?: string[] | null
          text_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number
          created_at: string | null
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          grading_status: Database["public"]["Enums"]["grading_status"] | null
          id: string
          max_possible_score: number | null
          percentage_score: number | null
          quiz_id: string
          started_at: string | null
          student_id: string
          submitted_at: string | null
          time_spent: number | null
          total_score: number | null
        }
        Insert: {
          attempt_number?: number
          created_at?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grading_status?: Database["public"]["Enums"]["grading_status"] | null
          id?: string
          max_possible_score?: number | null
          percentage_score?: number | null
          quiz_id: string
          started_at?: string | null
          student_id: string
          submitted_at?: string | null
          time_spent?: number | null
          total_score?: number | null
        }
        Update: {
          attempt_number?: number
          created_at?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grading_status?: Database["public"]["Enums"]["grading_status"] | null
          id?: string
          max_possible_score?: number | null
          percentage_score?: number | null
          quiz_id?: string
          started_at?: string | null
          student_id?: string
          submitted_at?: string | null
          time_spent?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          media_url: string | null
          order_index: number
          points: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          order_index: number
          points?: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_published: boolean | null
          max_attempts: number | null
          passing_score: number | null
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          randomize_answers: boolean | null
          randomize_questions: boolean | null
          show_results_immediately: boolean | null
          time_limit: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          max_attempts?: number | null
          passing_score?: number | null
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          randomize_answers?: boolean | null
          randomize_questions?: boolean | null
          show_results_immediately?: boolean | null
          time_limit?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          max_attempts?: number | null
          passing_score?: number | null
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          randomize_answers?: boolean | null
          randomize_questions?: boolean | null
          show_results_immediately?: boolean | null
          time_limit?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          previous_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          previous_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          previous_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notification_email: boolean | null
          notification_push: boolean | null
          notification_sms: boolean | null
          privacy_activity_visible: boolean | null
          privacy_profile_visible: boolean | null
          session_timeout: number | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          privacy_activity_visible?: boolean | null
          privacy_profile_visible?: boolean | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          privacy_activity_visible?: boolean | null
          privacy_profile_visible?: boolean | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_attendance: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          is_present: boolean | null
          joined_at: string | null
          left_at: string | null
          participant_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_present?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          participant_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_present?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          participant_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_attendance_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "video_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      video_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          course_id: string
          created_at: string
          description: string | null
          id: string
          instructor_id: string
          is_recorded: boolean | null
          max_participants: number | null
          meeting_id: string | null
          meeting_url: string | null
          passcode: string | null
          recording_url: string | null
          scheduled_end: string
          scheduled_start: string
          settings: Json | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          instructor_id: string
          is_recorded?: boolean | null
          max_participants?: number | null
          meeting_id?: string | null
          meeting_url?: string | null
          passcode?: string | null
          recording_url?: string | null
          scheduled_end: string
          scheduled_start: string
          settings?: Json | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string
          is_recorded?: boolean | null
          max_participants?: number | null
          meeting_id?: string | null
          meeting_url?: string | null
          passcode?: string | null
          recording_url?: string | null
          scheduled_end?: string
          scheduled_start?: string
          settings?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_grade_quiz_attempt: {
        Args: { attempt_id_param: string }
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["user_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_type:
        | "call"
        | "meeting"
        | "email"
        | "note"
        | "task"
        | "document_review"
      deal_stage:
        | "sourcing"
        | "initial_review"
        | "due_diligence"
        | "investment_committee"
        | "closing"
        | "closed_won"
        | "closed_lost"
      grading_status:
        | "pending"
        | "auto_graded"
        | "manually_graded"
        | "needs_review"
      question_type:
        | "multiple_choice"
        | "written_answer"
        | "audio_button"
        | "fill_blank"
        | "open_ended"
        | "multi_factor"
        | "ranking"
        | "picture_choice"
      quiz_type: "trivia" | "personality" | "graded" | "survey" | "poll"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
      user_role: "admin" | "crm_user" | "viewer" | "student" | "teacher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "call",
        "meeting",
        "email",
        "note",
        "task",
        "document_review",
      ],
      deal_stage: [
        "sourcing",
        "initial_review",
        "due_diligence",
        "investment_committee",
        "closing",
        "closed_won",
        "closed_lost",
      ],
      grading_status: [
        "pending",
        "auto_graded",
        "manually_graded",
        "needs_review",
      ],
      question_type: [
        "multiple_choice",
        "written_answer",
        "audio_button",
        "fill_blank",
        "open_ended",
        "multi_factor",
        "ranking",
        "picture_choice",
      ],
      quiz_type: ["trivia", "personality", "graded", "survey", "poll"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
      user_role: ["admin", "crm_user", "viewer", "student", "teacher"],
    },
  },
} as const
