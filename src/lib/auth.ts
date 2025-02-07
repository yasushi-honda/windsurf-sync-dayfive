import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey)
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
