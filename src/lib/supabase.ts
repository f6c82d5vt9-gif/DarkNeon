import { createClient } from "@supabase/supabase-js"

export const SUPABASE_URL = "https://<project>.supabase.co"
export const SUPABASE_ANON_KEY = "<anon key>"
export const IS_DEMO = SUPABASE_URL.includes("<project>")

const clientUrl = IS_DEMO ? "https://demo.supabase.co" : SUPABASE_URL
const clientKey = IS_DEMO ? "demo-anon-key" : SUPABASE_ANON_KEY

export const db = createClient(clientUrl, clientKey)
