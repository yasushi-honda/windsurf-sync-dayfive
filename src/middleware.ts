import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 開発環境では全てのリクエストを通す
  return NextResponse.next()
}
