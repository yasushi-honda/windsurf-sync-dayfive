import { headers } from 'next/headers'

export function getBaseUrl() {
  // クライアントサイドでwindow.locationを使用
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // サーバーサイドでは環境変数を使用
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

export function getCallbackUrl() {
  return `${getBaseUrl()}/auth/callback`
}
