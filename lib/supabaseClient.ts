// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase env missing", {
    url: supabaseUrl,
    key: supabaseKey ? "exists" : "missing",
  });
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseKey ?? ""
);
