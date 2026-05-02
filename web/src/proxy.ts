import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية مسارات الأدمين (ما عدا صفحة تسجيل الدخول)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payloadStr = await verifyToken(sessionCookie);
    if (!payloadStr) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const payload = JSON.parse(payloadStr);
      if (payload.role !== 'ADMIN' || payload.exp < Date.now()) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // إذا كان المستخدم مسجلاً للدخول وحاول الدخول لصفحة login، نوجهه للوحة
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      const payloadStr = await verifyToken(sessionCookie);
      if (payloadStr) {
        try {
          const payload = JSON.parse(payloadStr);
          if (payload.role === 'ADMIN' && payload.exp > Date.now()) {
            return NextResponse.redirect(new URL('/admin', request.url));
          }
        } catch {}
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
