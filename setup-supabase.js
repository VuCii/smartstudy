import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://npynutprsawyybxbiijp.supabase.co"
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW51dHByc2F3eXlieGJpaWpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODA2ODYyOSwiZXhwIjoyMDUzNjQ0NjI5fQ.yeM6O7rhCEv9MDMI8Aw9iTAaU89zNMaYTI0DIjswkMo"

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createTables() {
  try {
    // Create users table (extends the default auth.users table)
    const { error: usersError } = await supabase.rpc("create_users_table")
    if (usersError) throw usersError

    // Create user_profiles table
    const { error: profilesError } = await supabase.rpc("create_user_profiles_table")
    if (profilesError) throw profilesError

    // Create study_groups table
    const { error: groupsError } = await supabase.rpc("create_study_groups_table")
    if (groupsError) throw groupsError

    // Create user_group_memberships table
    const { error: membershipsError } = await supabase.rpc("create_user_group_memberships_table")
    if (membershipsError) throw membershipsError

    // Create resources table
    const { error: resourcesError } = await supabase.rpc("create_resources_table")
    if (resourcesError) throw resourcesError

    // Create chat_messages table
    const { error: chatError } = await supabase.rpc("create_chat_messages_table")
    if (chatError) throw chatError

    // Create events table
    const { error: eventsError } = await supabase.rpc("create_events_table")
    if (eventsError) throw eventsError

    // Create progress_tracking table
    const { error: progressError } = await supabase.rpc("create_progress_tracking_table")
    if (progressError) throw progressError

    console.log("All tables created successfully")
  } catch (error) {
    console.error("Error creating tables:", error)
  }
}

async function createStoredProcedures() {
  try {
    // Create users table procedure
    await supabase.rpc("create_procedure_create_users_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
        CREATE OR REPLACE FUNCTION public.handle_new_user() 
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.users (id, email)
          VALUES (NEW.id, NEW.email);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        CREATE OR REPLACE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
      `,
    })

    // Create user_profiles table procedure
    await supabase.rpc("create_procedure_create_user_profiles_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
          full_name TEXT,
          university TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `,
    })

    // Create study_groups table procedure
    await supabase.rpc("create_procedure_create_study_groups_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS study_groups (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          university TEXT,
          faculty TEXT,
          department TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          creator_id UUID REFERENCES users(id) NOT NULL
        );
      `,
    })

    // Create user_group_memberships table procedure
    await supabase.rpc("create_procedure_create_user_group_memberships_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS user_group_memberships (
          user_id UUID REFERENCES users(id) NOT NULL,
          group_id UUID REFERENCES study_groups(id) NOT NULL,
          role TEXT NOT NULL,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          PRIMARY KEY (user_id, group_id)
        );
      `,
    })

    // Create resources table procedure
    await supabase.rpc("create_procedure_create_resources_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS resources (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          url TEXT,
          file_path TEXT,
          resource_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          uploader_id UUID REFERENCES users(id) NOT NULL,
          study_group_id UUID REFERENCES study_groups(id)
        );
      `,
    })

    // Create chat_messages table procedure
    await supabase.rpc("create_procedure_create_chat_messages_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS chat_messages (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          user_id UUID REFERENCES users(id) NOT NULL,
          study_group_id UUID REFERENCES study_groups(id) NOT NULL
        );
      `,
    })

    // Create events table procedure
    await supabase.rpc("create_procedure_create_events_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS events (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          start_time TIMESTAMP WITH TIME ZONE NOT NULL,
          end_time TIMESTAMP WITH TIME ZONE NOT NULL,
          location TEXT,
          event_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          creator_id UUID REFERENCES users(id) NOT NULL,
          study_group_id UUID REFERENCES study_groups(id)
        );
      `,
    })

    // Create progress_tracking table procedure
    await supabase.rpc("create_procedure_create_progress_tracking_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS progress_tracking (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES users(id) NOT NULL,
          goal_name TEXT NOT NULL,
          description TEXT,
          target_date DATE,
          progress_percentage INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `,
    })

    console.log("All stored procedures created successfully")
  } catch (error) {
    console.error("Error creating stored procedures:", error)
  }
}

async function setup() {
  await createStoredProcedures()
  await createTables()
}

setup()

