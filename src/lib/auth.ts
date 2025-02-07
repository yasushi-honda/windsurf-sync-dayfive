import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseKey)
  return supabaseInstance
}

// セッション状態を監視するための共有サブスクリプション
let authSubscription: { unsubscribe: () => void } | undefined

export function subscribeToAuthChanges(callback: (event: string, session: any) => void) {
  if (authSubscription) {
    authSubscription.unsubscribe()
  }

  const client = createClient()
  authSubscription = client.auth.onAuthStateChange(callback).data.subscription
  return authSubscription
}

export function unsubscribeFromAuthChanges() {
  if (authSubscription) {
    authSubscription.unsubscribe()
    authSubscription = undefined
  }
}
