import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ダッシュボードとAPIエンドポイントは除外
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/records')) {
    return NextResponse.next()
  }

  // その他のURLはすべてダッシュボードにリダイレクト
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
