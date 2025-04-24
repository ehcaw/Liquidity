import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

interface AppMetadata {
  role?: string;
  provider?: string;
  providers?: string[];
}

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const pathname = request.nextUrl.pathname;
    const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

    if (isAdminPath) {
      // no session
      if (!session) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/signin';
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // get user role
      const appMetadata = session.user?.app_metadata as AppMetadata | undefined;
      const userRole = appMetadata?.role;

      // not an admin
      if (userRole !== 'admin') {
        if (pathname.startsWith('/api/admin')) {
          return new NextResponse(JSON.stringify({ error: 'Forbidden: Admin role required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        } else {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/unauthorized';
          return NextResponse.redirect(redirectUrl);
        }
      }
      return response;
    }

  } catch (e) {
    console.error("Error in Supabase middleware:", e);
    return NextResponse.next({ request: { headers: request.headers } });
  }
};
