export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          staff_id: string | null
          category_id: string | null
          content: string | null
          users: { name: string } | null
          staff: { name: string } | null
          record_categories: { name: string } | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          staff_id?: string | null
          category_id?: string | null
          content?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          staff_id?: string | null
          category_id?: string | null
          content?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
        }
      }
      staff: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
        }
      }
      record_categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
        }
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: Record<string, unknown>
    }
  }
}
