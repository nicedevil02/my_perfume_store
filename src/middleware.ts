import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // اضافه کردن هدرهای امنیتی و کش
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // کش کردن منابع استاتیک
  if (request.nextUrl.pathname.startsWith('/_next/static') || 
      request.nextUrl.pathname.startsWith('/images')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
