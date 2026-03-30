// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // or whatever cookie/JWT you use

  if (!token && req.nextUrl.pathname.startsWith('/admin-dashboard')) {
    return NextResponse.redirect(new URL('/admin-login', req.url));
  }

  return NextResponse.next();
}

// Apply to routes
export const config = {
  matcher: ['/admin-dashboard/:path*', '/api/admin/:path*'],
};