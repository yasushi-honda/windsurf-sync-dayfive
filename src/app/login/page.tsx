'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient, subscribeToAuthChanges, unsubscribeFromAuthChanges, checkSession } from '@/lib/auth'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getCallbackUrl } from '@/utils/url'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState<string>('')
  const redirectAttempts = useRef(0)
  const isMounted = useRef(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // クライアントサイドでのみコールバックURLを設定
    setCallbackUrl(getCallbackUrl())
  }, [])

  const redirectToDashboard = useCallback(async () => {
    if (!isRedirecting && isMounted.current) {
      try {
        console.log('Checking session before redirect...')
        const { session } = await checkSession()
        
        if (!session) {
          console.log('No valid session found, cannot redirect')
          return
        }

        console.log('Valid session found, redirecting...')
        setIsRedirecting(true)
        
        // リダイレクト先を取得
        const redirectTo = searchParams?.get('redirectTo') || '/dashboard'
        router.replace(redirectTo)

      } catch (error) {
        console.error('Error during redirect:', error)
        setError('リダイレクト中にエラーが発生しました。')
        setIsRedirecting(false)
      }
    }
  }, [isRedirecting, router, searchParams])

  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    if (!isMounted.current) return

    console.log('Auth state changed:', event, session ? 'with session' : 'no session')
    
    if (session) {
      // セッションが存在する場合、リダイレクトを試行
      if (redirectAttempts.current < 3) {
        redirectAttempts.current += 1
        await redirectToDashboard()
      } else {
        console.error('Max redirect attempts reached')
        setError('リダイレクトに失敗しました。ページを更新してください。')
      }
    }
  }, [redirectToDashboard])

  useEffect(() => {
    // URLパラメータのエラーをチェック
    const errorParam = searchParams?.get('error')
    const errorMessage = searchParams?.get('message')

    if (errorParam === 'auth') {
      setError(errorMessage || '認証に失敗しました。もう一度お試しください。')
      return
    }

    async function initializeAuth() {
      try {
        // 現在のセッションを確認
        const { session, error: sessionError } = await checkSession()
        if (sessionError) throw sessionError

        if (session) {
          console.log('Existing session found')
          await handleAuthChange('INITIAL_SESSION', session)
          return
        }

        // Auth状態の変更を監視
        subscribeToAuthChanges(handleAuthChange)
      } catch (error) {
        console.error('Error checking session:', error)
        if (isMounted.current) {
          setError('認証の確認中にエラーが発生しました。')
        }
      }
    }

    initializeAuth()

    return () => {
      console.log('Cleaning up login page...')
      isMounted.current = false
      unsubscribeFromAuthChanges()
    }
  }, [handleAuthChange, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">エラーが発生しました</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                redirectAttempts.current = 0
                router.replace('/login')
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              もう一度試す
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">リダイレクト中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        {callbackUrl && (
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
            localization={{
              variables: {
                sign_in: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'ログイン',
                  loading_button_label: '処理中...',
                  password_input_placeholder: 'パスワードを入力',
                  email_input_placeholder: 'メールアドレスを入力',
                  link_text: 'ログインする',
                  confirmation_text: 'メールアドレスを確認してください',
                },
                sign_up: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'アカウント作成',
                  loading_button_label: '処理中...',
                  password_input_placeholder: 'パスワードを入力',
                  email_input_placeholder: 'メールアドレスを入力',
                  link_text: 'アカウントを作成する',
                  confirmation_text: 'メールアドレスを確認してください',
                },
              },
            }}
            providers={[]}
            redirectTo={callbackUrl}
          />
        )}
      </div>
    </div>
  )
}
