import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SigninRequestBody } from "@/utils/zod/auth";

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  let body;

  try {
    body = SigninRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
        headers: corsHeaders, // Add headers here
      },
    );
  }

  const supabase = await createClient();

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

    if (authError) {
      throw authError;
    }

    // Get the session and token information
    const session = authData.session;

    const { data, error: selectError } = await supabase
      .from("users")
      .select()
      .eq("email", body.email);

    if (selectError) {
      throw selectError;
    }

    return Response.json(
      {
        data: data[0],
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return Response.json(
      { error },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
