export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          admin_note: string | null
          admin_output: Json | null
          created_at: string
          id: string
          service_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_cost: number
          updated_at: string
          user_id: string
          user_inputs: Json
        }
        Insert: {
          admin_note?: string | null
          admin_output?: Json | null
          created_at?: string
          id?: string
          service_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cost: number
          updated_at?: string
          user_id: string
          user_inputs?: Json
        }
        Update: {
          admin_note?: string | null
          admin_output?: Json | null
          created_at?: string
          id?: string
          service_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cost?: number
          updated_at?: string
          user_id?: string
          user_inputs?: Json
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
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
          email: string | null
          frozen_xu: number
          full_name: string | null
          id: string
          role: string
          updated_at: string
          xu_balance: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          frozen_xu?: number
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
          xu_balance?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          frozen_xu?: number
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          xu_balance?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          base_cost: number
          cover_image: string | null
          created_at: string
          description: string | null
          form_config: Json
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          base_cost: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          form_config?: Json
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          base_cost?: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          form_config?: Json
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
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
      cancel_order: {
        Args: { p_admin_note: string; p_order_id: string }
        Returns: undefined
      }
      complete_order: {
        Args: { p_admin_output: Json; p_order_id: string }
        Returns: undefined
      }
      create_order: {
        Args: {
          p_service_id: string
          p_total_cost: number
          p_user_inputs: Json
        }
        Returns: string
      }
      top_up_user: {
        Args: { p_amount: number; p_email: string }
        Returns: undefined
      }
    }
    Enums: {
      order_status: "pending" | "processing" | "completed" | "cancelled"
      transaction_type: "deposit" | "expense" | "refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Entity types
export type Profile = Tables<'profiles'>
export type Service = Tables<'services'>
export type Order = Tables<'orders'>
export type Transaction = Tables<'transactions'>
export type OrderStatus = Enums<'order_status'>
export type TransactionType = Enums<'transaction_type'>

// Form config types for dynamic service forms
export interface FormField {
  id: string
  type: 'text' | 'textarea' | 'file' | 'image' | 'video' | 'dropdown' | 'toggle'
  label: string
  placeholder?: string
  required?: boolean
  accept?: string  // For file inputs
  options?: { value: string; label: string }[]  // For dropdown
}

export interface FormConfig {
  fields: FormField[]
}

// Order with service details
export interface OrderWithService extends Order {
  services: Service
}
