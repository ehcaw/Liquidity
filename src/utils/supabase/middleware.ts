import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   {
    //     cookies: {
    //       getAll() {
    //         return request.cookies.getAll();
    //       },
    //       setAll(cookiesToSet) {
    //         cookiesToSet.forEach(({ name, value }) =>
    //           request.cookies.set(name, value),
    //         );
    //         response = NextResponse.next({
    //           request,
    //         });
    //         cookiesToSet.forEach(({ name, value, options }) =>
    //           response.cookies.set(name, value, options),
    //         );
    //       },
    //     },
    //   },
    // );

    // do user authorization

    return response;
  } catch (e) {
    console.log(e);
    // supabase client not working
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

