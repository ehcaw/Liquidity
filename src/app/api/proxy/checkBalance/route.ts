import { getAccountDailyBalanceProxy } from "@/services/banking/account";
import { ClientError, ServerError } from "@/utils/exceptions";
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

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ account_number: string }> },
) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  const { account_number } = await params;
  try {
    const balance = await getAccountDailyBalanceProxy(account_number);
    return Response.json({ data: balance });
  } catch (error) {
    console.log(error);
    if (error instanceof ClientError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
          headers: corsHeaders,
        },
      );
    } else if (error instanceof ServerError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
          headers: corsHeaders,
        },
      );
    }
    return Response.json(
      { error: error },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
