import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://npynutprsawyybxbiijp.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW51dHByc2F3eXlieGJpaWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjg2MjksImV4cCI6MjA1MzY0NDYyOX0.4aXpRc8RcuGpaYEk8Di6e9oDfCBSHlYcm_mgimim8gE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define table names
export const TABLES = {
  USERS: "users",
  USER_PROFILES: "user_profiles",
  STUDY_GROUPS: "study_groups",
  USER_GROUP_MEMBERSHIPS: "user_group_memberships",
  RESOURCES: "resources",
  CHAT_MESSAGES: "chat_messages",
  EVENTS: "events",
  PROGRESS_TRACKING: "progress_tracking",
}

// Authentication helper functions
export const signUp = async (email: string, password: string, fullName: string, university: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  if (data.user) {
    const { error: profileError } = await supabase.from(TABLES.USER_PROFILES).insert([
      {
        user_id: data.user.id,
        full_name: fullName,
        university: university,
      },
    ])
    if (profileError) throw profileError
  }

  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from(TABLES.USER_PROFILES).select("*").eq("user_id", userId).single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (
  userId: string,
  updates: Partial<{ full_name: string; university: string }>,
) => {
  const { data, error } = await supabase.from(TABLES.USER_PROFILES).update(updates).eq("user_id", userId)

  if (error) throw error
  return data
}

