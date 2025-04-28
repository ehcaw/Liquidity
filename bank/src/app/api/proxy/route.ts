import { deposit, withdraw } from "@/services/banking/proxy";
import { Database } from "@/types/db";
import { ClientError, ServerError } from "@/utils/exceptions";
import { PostProxyTransactionRequestBody } from "@/utils/zod/proxy";
import { NextRequest } from "next/server";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  let body;
  try {
    body = PostProxyTransactionRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
        headers: corsHeaders,
      },
    );
  }

  try {
    let transaction: Transaction | null = null;
    switch (body.transaction_type) {
      case "Deposit":
        transaction = await deposit(body.account_number, body.amount);
        break;
      case "Withdraw":
        transaction = await withdraw(body.account_number, body.amount);
        break;
    }

    return Response.json(
      { data: transaction },
      {
        status: 201,
        headers: corsHeaders,
      },
    );
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
