import { verifyPinCode } from "@/services/banking/account";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ account_number: string, pin_code: string }> },
) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  const { account_number, pin_code } = await params;
  try {
    const verified = await verifyPinCode(account_number, pin_code);
    return Response.json({ data: verified }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
