'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient, subscribeToAuthChanges, unsubscribeFromAuthChanges } from '@/lib/auth'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  const handleRedirect = useCallback(() => {
    if (!isRedirecting) {
      setIsRedirecting(true)
      console.log('Redirecting to dashboard...')
      router.push('/dashboard')
    }
  }, [isRedirecting, router])

  useEffect(() => {
    async function initializeAuth() {
      try {
        const client = createClient()
        console.log('Supabase client created successfully')
        setSupabase(client)

        // 現在のセッションを確認
        const { data: { session } } = await client.auth.getSession()
        if (session) {
          console.log('Existing session found')
          handleRedirect()
          return
        }

        // Auth状態の変更を監視
        subscribeToAuthChanges((event, session) => {
          console.log('Auth state changed:', event, session ? 'with session' : 'no session')
          
          if (event === 'SIGNED_IN' && session) {
            handleRedirect()
          }
        })

      } catch (err) {
        console.error('Error creating Supabase client:', err)
        setError('認証クライアントの初期化に失敗しました')
      }
    }

    initializeAuth()

    return () => {
      unsubscribeFromAuthChanges()
    }
  }, [handleRedirect])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!supabase || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div>{isRedirecting ? 'ダッシュボードに移動中...' : '読み込み中...'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            職員ログイン
          </h2>
        </div>
        <div className="mt-8">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: '#4F46E5', color: 'white' },
                anchor: { color: '#4F46E5' },
                message: { color: '#EF4444' }
              }
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'ログイン',
                },
                sign_up: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'アカウント作成',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
