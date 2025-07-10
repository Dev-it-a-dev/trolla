import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if environment variables are missing (for build process)
const createMockClient = () => {
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null })
  }

  return {
    from: () => mockQueryBuilder,
    channel: () => ({
      on: () => ({
        on: () => ({
          subscribe: () => {}
        })
      })
    })
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

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