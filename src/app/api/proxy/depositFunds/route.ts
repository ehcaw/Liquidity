import { depositFundsService } from "@/services/banking/transaction";
import { createClient } from "@/utils/supabase/server";

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

export async function POST(req: Request) {
  // Define CORS headers that need to be included with every response
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  const supabase = await createClient();

  try {
    const { accountNumber, amountNumber, token } = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (user) {
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
    }
    const { accountNumber, amountNumber } = await req.json();
    const depositService = await depositFundsService(
      accountNumber,
      amountNumber,
    );

    if (!depositService.success) {
      return new Response(JSON.stringify({ error: depositService.error }), {
        status: 400,
        headers: corsHeaders,
      });
    } else {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("Error processing deposit:", error);

    return new Response(
      JSON.stringify({
        error: JSON.stringify(error) || "Failed to process deposit",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
