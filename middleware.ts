import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateCurrentSession } from '@/lib/auth-custom'

// Routes that require authentication
const protectedRoutes = [
  '/admin',
  '/profile',
  '/settings',
  '/subscription',
  '/ai-radio'
]

// Routes that require admin role
const adminRoutes = [
  '/admin'
]

// Routes that require premium subscription
const premiumRoutes = [
  '/ai-radio'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isPremiumRoute = premiumRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get session token from cookies
  let sessionToken = request.cookies.get('aura_session')?.value
  
  // Fallback to Authorization header
  if (!sessionToken) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7)
    }
  }

  if (!sessionToken) {
    return redirectToLogin(request)
  }

  try {
    // Validate session using our custom auth system
    const userData = await validateCurrentSession()
    
    if (!userData) {
      // Session is invalid, clear cookie and redirect to login
      const response = redirectToLogin(request)
      response.cookies.delete('aura_session')
      return response
    }

    // Check admin access
    if (isAdminRoute && userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Check premium access
    if (isPremiumRoute && !canUseAIFeatures(userData)) {
      return NextResponse.redirect(new URL('/subscription', request.url))
    }

    // Add user data to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', userData.id)
    requestHeaders.set('x-user-role', userData.role)
    requestHeaders.set('x-user-subscription', userData.subscription_plan)
    requestHeaders.set('x-user-email', userData.email)
    requestHeaders.set('x-user-name', userData.full_name || '')

    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })

    // Refresh session cookie if valid (extend expiry)
    response.cookies.set('aura_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    const response = redirectToLogin(request)
    response.cookies.delete('aura_session')
    return response
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = new URL('/auth/login', request.url)
  // Optionally add redirect parameter to return user to intended page after login
  url.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

function canUseAIFeatures(userData: any): boolean {
  return (
    userData.subscription_status === 'active' &&
    (userData.subscription_plan === 'premium' || userData.subscription_plan === 'family')
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
