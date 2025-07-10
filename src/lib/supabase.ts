import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create the client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface DatabaseBoard {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseList {
  id: string
  title: string
  board_id: string
  order: number
  created_at: string
  updated_at: string
}

export interface DatabaseCard {
  id: string
  title: string
  description?: string
  list_id: string
  order: number
  created_at: string
  updated_at: string
} 