import { getUserAccount } from "@/services/banking/account";
import { ClientError, ServerError } from "@/utils/exceptions";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";




export async function GET(_: NextRequest, {params}: {params: Promise<{ account_number: string }>}) {
    const supabase = await createClient();
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      };
  const { account_number } = await params;
  try {
    const {data, error} = await supabase.from("accounts").select().eq("account_number", account_number);
    if (error) {
        throw new ServerError(error.message);
      }
    return Response.json({ data: data[0] }, {headers: corsHeaders});
  } catch (error) {
    console.log(error);
    if (error instanceof ClientError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status, 
          headers: corsHeaders
        },
      );
    } else if (error instanceof ServerError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
          headers: corsHeaders
        },
      );
    }
    return Response.json(
      { error: error },
      {
        status: 500,
        headers: corsHeaders
      },
    );
  }
}
