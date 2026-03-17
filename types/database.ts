/**
 * Auto-generated-style database types for CoinSprout.
 * Mirrors the Supabase Postgres schema exactly.
 * Update this file whenever the schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TransactionSource = 'allowance' | 'gift' | 'interest' | 'jobs' | 'spend'
export type MilestoneType = 'bunny' | 'bird' | 'deer' | 'owl' | 'fox'

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          owner_user_id: string
          parent_pin_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          parent_pin_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          parent_pin_hash?: string | null
          created_at?: string
        }
        Relationships: []
      }

      children: {
        Row: {
          id: string
          family_id: string
          name: string
          birthdate: string | null
          avatar_color: string | null
          pin_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          birthdate?: string | null
          avatar_color?: string | null
          pin_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          birthdate?: string | null
          avatar_color?: string | null
          pin_hash?: string | null
          created_at?: string
        }
        Relationships: []
      }

      transactions: {
        Row: {
          id: string
          child_id: string
          amount: number
          source: TransactionSource
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          amount: number
          source: TransactionSource
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          amount?: number
          source?: TransactionSource
          note?: string | null
          created_at?: string
        }
        Relationships: []
      }

      goals: {
        Row: {
          id: string
          child_id: string
          name: string
          target_price: number
          allocated_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          name: string
          target_price: number
          allocated_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          name?: string
          target_price?: number
          allocated_amount?: number
          created_at?: string
        }
        Relationships: []
      }

      goal_allocations: {
        Row: {
          id: string
          goal_id: string
          transaction_id: string | null
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          transaction_id?: string | null
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          transaction_id?: string | null
          amount?: number
          created_at?: string
        }
        Relationships: []
      }

      milestones: {
        Row: {
          id: string
          child_id: string
          milestone_type: MilestoneType
          unlocked_at: string
        }
        Insert: {
          id?: string
          child_id: string
          milestone_type: MilestoneType
          unlocked_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          milestone_type?: MilestoneType
          unlocked_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// Convenience row types
export type Family = Database['public']['Tables']['families']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type GoalAllocation = Database['public']['Tables']['goal_allocations']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
