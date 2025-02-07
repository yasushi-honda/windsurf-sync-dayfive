'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    try {
      const client = createClient()
      console.log('Supabase client created successfully')
      setSupabase(client)

      // Auth状態の変更を監視
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.error('Error creating Supabase client:', err)
      setError('認証クライアントの初期化に失敗しました')
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div>読み込み中...</div>
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
