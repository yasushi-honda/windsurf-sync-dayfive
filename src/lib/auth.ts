import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { type AuthChangeEvent, type Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

let supabase: ReturnType<typeof createSupabaseClient> | null = null
let authSubscription: { unsubscribe: () => void } | null = null
let authChangeCallbacks: Set<(event: AuthChangeEvent, session: Session | null) => void> = new Set()

export function createClient() {
  if (!supabase) {
    console.log('Creating new Supabase client...')
    supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'app-session',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    })

    // セッションの自動更新を有効化
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed')
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        unsubscribeFromAuthChanges()
        clearAuthData()
      }
    })
  }
  return supabase
}

export function subscribeToAuthChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const client = createClient()

  // コールバックを登録
  authChangeCallbacks.add(callback)

  // 既存の購読を解除
  unsubscribeFromAuthChanges()

  console.log('Subscribing to auth changes...')
  
  // 新しい購読を設定
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session ? 'with session' : 'no session')

    // INITIAL_SESSIONイベントの場合は、セッションがある場合のみコールバックを呼び出す
    if (event === 'INITIAL_SESSION' && !session) {
      return
    }

    // 登録されているすべてのコールバックを呼び出す
    authChangeCallbacks.forEach(cb => {
      try {
        cb(event, session)
      } catch (error) {
        console.error('Error in auth change callback:', error)
      }
    })
  })

  authSubscription = subscription
}

export function unsubscribeFromAuthChanges() {
  if (authSubscription) {
    console.log('Unsubscribing from auth changes...')
    authSubscription.unsubscribe()
    authSubscription = null
  }
}

export function clearAuthData() {
  authChangeCallbacks.clear()
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('app-session')
  }
}

export async function signOut() {
  const client = createClient()
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error
    console.log('Successfully signed out')
    unsubscribeFromAuthChanges()
    clearAuthData()
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * セッションの有効性を確認します。
 * 
 * @returns {Promise<{ session: Session | null, error: Error | null }>} 
 *          セッション情報とエラー情報を含むオブジェクトを返します。
 */
export async function checkSession(): Promise<{ session: Session | null, error: Error | null }> {
  const client = createClient()
  try {
    const { data: { session }, error } = await client.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    console.error('Error checking session:', error)
    return { session: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// セッションの更新を試行
export async function refreshSession() {
  const client = createClient()
  try {
    const { data: { session }, error } = await client.auth.refreshSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    console.error('Error refreshing session:', error)
    return { session: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}
