import { getAccountTransactions } from "@/services/banking/account";
import { getAllTransactions } from "@/services/banking/transaction";
import { ClientError, ServerError } from "@/utils/exceptions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{ account_number: string }>}) {
  const { account_number } = await params;
  try {
    const transactions = await getAccountTransactions(account_number);
    return Response.json({ data: transactions });
  } catch (error) {
    console.log(error);
    if (error instanceof ClientError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
        },
      );
    } else if (error instanceof ServerError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
        },
      );
    }
    return Response.json(
      { error: error },
      {
        status: 500,
      },
    );
  }
}
