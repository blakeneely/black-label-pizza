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
      cart_items: {
        Row: {
          id: string
          created_at: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          quantity: number
          size: string | null
          toppings: Json | null
          removed_toppings: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          quantity: number
          size?: string | null
          toppings?: Json | null
          removed_toppings?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          product_id?: string
          product_name?: string
          price?: number
          quantity?: number
          size?: string | null
          toppings?: Json | null
          removed_toppings?: string[] | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          phone_number: string
          customer_info: Json
          status: string
          total: number
          items: Json
        }
        Insert: {
          id?: string
          created_at?: string
          phone_number: string
          customer_info: Json
          status: string
          total: number
          items: Json
        }
        Update: {
          id?: string
          created_at?: string
          phone_number?: string
          customer_info?: Json
          status?: string
          total?: number
          items?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
