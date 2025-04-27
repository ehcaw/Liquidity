import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return Response.json(
        { error: "Authentication required" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    const supabase = await createClient();

    // Get user from token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { error: "Invalid token" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    // Get user ID from the public.users table using email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email || "")
      .single();

    if (userError || !userData) {
      console.error("Error getting user from email:", userError);
      return Response.json(
        { error: "User not found" },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    // Now use this correct ID to query accounts
    const { data, error: selectError } = await supabase
      .from("accounts")
      .select()
      .eq("user_id", userData.id)
      .eq("status", "Active");

    if (selectError) {
      console.error("Error fetching accounts:", selectError);
      return Response.json(
        { error: selectError.message },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    return Response.json(
      { data },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return Response.json(
      { error: "Server error", details: JSON.stringify(error) },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
