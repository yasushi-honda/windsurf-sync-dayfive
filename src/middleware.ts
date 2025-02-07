import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ルートパスの場合のみダッシュボードにリダイレクト
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // その他のパスはそのまま通す
  return NextResponse.next()
}
