import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/cart',
  '/lists',
  '/recipes',
  '/store',
  '/profile',
]

// Add paths that should redirect to dashboard if user is authenticated
const authPaths = [
  '/login',
  '/onboarding',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('intellicart-token')?.value

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // If accessing a protected path without token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth paths with token, redirect to dashboard
  if (isAuthPath && token) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 