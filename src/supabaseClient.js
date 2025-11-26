import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lrirpaqfneicegdygiih.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyaXJwYXFmbmVpY2VnZHlnaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTE3MTksImV4cCI6MjA3OTE4NzcxOX0.qyIgvNjxRiBLlMaRxMp6q0t6pe9CTOr4Aeww41BVPTA";

export const supabase = createClient(supabaseUrl, supabaseKey);
