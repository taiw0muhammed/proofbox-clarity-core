export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      amendments: {
        Row: {
          created_at: string
          created_by: string
          id: string
          new_data: Json
          previous_data: Json
          proof_box_id: string
          reason: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          new_data?: Json
          previous_data?: Json
          proof_box_id: string
          reason: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          new_data?: Json
          previous_data?: Json
          proof_box_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "amendments_proof_box_id_fkey"
            columns: ["proof_box_id"]
            isOneToOne: false
            referencedRelation: "proof_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          proof_box_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          proof_box_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          proof_box_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_proof_box_id_fkey"
            columns: ["proof_box_id"]
            isOneToOne: false
            referencedRelation: "proof_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          proof_box_id: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          proof_box_id?: string | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          proof_box_id?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_proof_box_id_fkey"
            columns: ["proof_box_id"]
            isOneToOne: false
            referencedRelation: "proof_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          change_request: string | null
          confirmation_status: string
          confirmed_at: string | null
          created_at: string
          display_name: string | null
          id: string
          invite_email: string | null
          invite_token: string
          proof_box_id: string
          role: string
          user_id: string | null
        }
        Insert: {
          change_request?: string | null
          confirmation_status?: string
          confirmed_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          invite_email?: string | null
          invite_token?: string
          proof_box_id: string
          role?: string
          user_id?: string | null
        }
        Update: {
          change_request?: string | null
          confirmation_status?: string
          confirmed_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          invite_email?: string | null
          invite_token?: string
          proof_box_id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_proof_box_id_fkey"
            columns: ["proof_box_id"]
            isOneToOne: false
            referencedRelation: "proof_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notify_confirmations: boolean
          notify_evidence: boolean
          notify_reminders: boolean
          onboarded: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notify_confirmations?: boolean
          notify_evidence?: boolean
          notify_reminders?: boolean
          onboarded?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notify_confirmations?: boolean
          notify_evidence?: boolean
          notify_reminders?: boolean
          onboarded?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      proof_boxes: {
        Row: {
          amount: number | null
          code: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          creator_id: string
          currency: string
          description: string | null
          dispute_reason: string | null
          due_date: string | null
          id: string
          responsibilities: string | null
          start_date: string | null
          status: string
          terms: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          code?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          creator_id: string
          currency?: string
          description?: string | null
          dispute_reason?: string | null
          due_date?: string | null
          id?: string
          responsibilities?: string | null
          start_date?: string | null
          status?: string
          terms?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          code?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          creator_id?: string
          currency?: string
          description?: string | null
          dispute_reason?: string | null
          due_date?: string | null
          id?: string
          responsibilities?: string | null
          start_date?: string | null
          status?: string
          terms?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          created_at: string
          description: string | null
          event_type: string
          id: string
          proof_box_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          proof_box_id: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          proof_box_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_proof_box_id_fkey"
            columns: ["proof_box_id"]
            isOneToOne: false
            referencedRelation: "proof_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_box: { Args: { _box: string }; Returns: boolean }
      claim_invitation: { Args: { _token: string }; Returns: string }
      invite_participant: {
        Args: { _box: string; _email: string; _name: string; _role: string }
        Returns: {
          change_request: string | null
          confirmation_status: string
          confirmed_at: string | null
          created_at: string
          display_name: string | null
          id: string
          invite_email: string | null
          invite_token: string
          proof_box_id: string
          role: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "participants"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_box_creator: { Args: { _box: string }; Returns: boolean }
      notify_box_participants: {
        Args: {
          _box: string
          _message: string
          _skip: string
          _title: string
          _type: string
        }
        Returns: undefined
      }
      shares_box_with: { Args: { _other: string }; Returns: boolean }
      verify_proof_box: {
        Args: { _code: string }
        Returns: {
          code: string
          confirmed_count: number
          created_at: string
          participant_count: number
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
