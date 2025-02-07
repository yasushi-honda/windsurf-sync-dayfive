# Supabase認証の実装手順

## 1. 環境構築

### 1.1 必要なパッケージのインストール
```bash
# Supabaseの認証パッケージをインストール
npm uninstall @supabase/auth-helpers-nextjs
npm install @supabase/ssr
```

### 1.2 環境変数の設定
`.env.local`に以下の環境変数を設定：
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. 認証機能の実装

### 2.1 ミドルウェアの作成
`middleware.ts`を作成し、認証ロジックを実装：
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### 2.2 ログインページの作成
`app/login/page.tsx`を作成：
```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError('予期せぬエラーが発生しました')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">ログイン</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            メモアプリにログインしてください
          </p>
        </div>

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/15 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border bg-background px-4 py-2 text-foreground shadow-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border bg-background px-4 py-2 text-foreground shadow-sm focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium shadow hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            ログイン
          </button>
        </form>
      </div>
    </main>
  )
}
```

## 3. Vercelへのデプロイ

### 3.1 環境変数の設定
1. Vercelのダッシュボードで環境変数を設定
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.2 デプロイの実行
1. GitHubにプッシュ
2. Vercelが自動的にデプロイを開始
3. デプロイ完了後、以下のURLでアクセス可能：
   - https://windsurf-sync-dayfive.vercel.app/

## 4. トラブルシューティング

### 4.1 404エラーの解決
1. `Metadata`型のインポートエラーを修正
```typescript
// app/layout.tsx
import { Metadata } from 'next'
```

### 4.2 環境変数の確認
1. ローカル環境での`.env.local`の設定
2. Vercelダッシュボードでの環境変数の設定
3. デプロイの再実行

## 5. 動作確認

### 5.1 認証フロー
1. `/` にアクセス → `/login` にリダイレクト
2. ログイン成功 → `/` にリダイレクト
3. 認証済みユーザー → `/login` にアクセス → `/` にリダイレクト

## 6. 今後の課題
1. サインアップ機能の実装
2. パスワードリセット機能の追加
3. ソーシャルログインの統合
4. エラーメッセージの多言語対応
