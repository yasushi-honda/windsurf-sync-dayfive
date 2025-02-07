# メモアプリケーション

Supabaseを使用したシンプルなメモアプリケーションです。

## デプロイ済みURL

https://windsurf-sync-dayfive.vercel.app/

## 機能

- ✅ Supabase認証
- ✅ メモの作成・編集・削除
- ✅ ダークモード対応
- ✅ レスポンシブデザイン

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (認証・データベース)
- Vercel (ホスティング)

## セットアップ手順

### 1. 環境構築

```bash
# リポジトリのクローン
git clone https://github.com/your-username/windsurf-sync-dayfive.git
cd windsurf-sync-dayfive

# 依存パッケージのインストール
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションにアクセスできます。

## 認証機能の実装手順

### 1. 必要なパッケージのインストール
```bash
# Supabaseの認証パッケージをインストール
npm uninstall @supabase/auth-helpers-nextjs
npm install @supabase/ssr
```

### 2. 認証機能の実装

#### 2.1 ミドルウェアの作成
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

#### 2.2 ログインページの作成
`app/login/page.tsx`を作成し、ログインフォームを実装。詳細なコードは[こちら](docs/authentication-setup.md)を参照してください。

### 3. Vercelへのデプロイ

1. GitHubにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. デプロイを実行

## 認証フローの確認

1. `/` にアクセス → 未認証の場合は `/login` にリダイレクト
2. ログイン成功 → `/` にリダイレクト
3. 認証済みユーザーが `/login` にアクセス → `/` にリダイレクト

## 今後の課題

1. サインアップ機能の実装
2. パスワードリセット機能の追加
3. ソーシャルログインの統合
4. エラーメッセージの多言語対応

## ライセンス

MIT
