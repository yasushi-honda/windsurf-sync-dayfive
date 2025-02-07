import { headers } from 'next/headers'

export function getBaseUrl() {
  // 本番環境のURLを環境変数から取得
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  // 開発環境では固定のURLを使用
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // その他の環境ではwindow.locationを使用（クライアントサイドのみ）
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // フォールバック
  return 'http://localhost:3000'
}

export function getCallbackUrl() {
  return `${getBaseUrl()}/auth/callback`
}
