// Supabase client configuration
// In demo mode (VITE_DEMO_MODE=true), this client will not make real API calls
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for production use

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const IS_DEMO_MODE = isDemoMode

// Demo mode notice
if (isDemoMode) {
  console.info(
    '%c🚀 HelpLoop is running in DEMO MODE',
    'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
  )
  console.info(
    '%cAll payments are simulated. No real data is being processed.',
    'color: #059669; font-style: italic;'
  )
}
