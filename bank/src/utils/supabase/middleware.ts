import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { ClientError } from "../exceptions";

const ADMIN_ROLE = "Admin";
const ADMIN_PATHS = ["/admin", "/api/admin"];
const UNAUTHORIZED_PATH = "/unauthorized";
const SIGNIN_PATH = "/signin";

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
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options: CookieOptions;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const pathname = request.nextUrl.pathname;
    const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));

    if (!isAdminPath) {
      return response;
    }

    // unauthenticated users for admin paths
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = SIGNIN_PATH;
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // check admin role for authenticated users
    const userEmail = session.user?.email;
    if (!userEmail) {
      throw new ClientError("User email not found in session", 400);
    }

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select()
      .ilike("email", userEmail) // case insensitive
      .single();

    if (dbError) {
      throw new ClientError(dbError.message, 404);
    }

    if (userData.role !== ADMIN_ROLE) {
      if (pathname.startsWith("/api/admin")) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Admin role required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = UNAUTHORIZED_PATH;
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (e) {
    console.error("Error in Supabase middleware:", e);
    if (e instanceof ClientError) {
      // specific client errors if needed
    }
    return NextResponse.next({ request: { headers: request.headers } });
  }
};
