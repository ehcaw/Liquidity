import { withdrawProxy } from "@/services/banking/account";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Get token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    const { accountNumber, amountNumber } = await request.json();

    // Use token for authentication when calling the withdraw function
    const supabase = await createClient();

    // Get user info from token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get user ID from users table based on email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email || "")
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Now call the withdraw function with the verified user context
    const result = await withdrawProxy(accountNumber, amountNumber);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);

    return new Response(
      JSON.stringify({
        error: JSON.stringify(error) || "Failed to process withdrawal",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
