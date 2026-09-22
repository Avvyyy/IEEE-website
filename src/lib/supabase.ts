import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.warn(
    "[supabase] SUPABASE_URL or SUPABASE_SERVICE_KEY is not set. " +
      "Add them to .env.local before using the admin dashboard."
  );
}

export const supabase = createClient(url ?? "", key ?? "", {
  auth: { persistSession: false },
});
