import { Database } from "@/types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  String(process.env.EXPO_PUBLIC_SUPABASE_URL),
  String(process.env.EXPO_PUBLIC_SUPABASE_KEY)
);
