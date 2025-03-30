import { deposit, transfer, withdraw } from "@/services/banking/account";
import { createTransaction } from "@/services/banking/transaction";
import { Database } from "@/types/db";
import { ClientError, ServerError } from "@/utils/exceptions";
import { PostTransactionRequestBody } from "@/utils/zod/transaction";
import { NextRequest } from "next/server";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export async function POST(req: NextRequest) {
  let body;
  try {
    body = PostTransactionRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      },
    );
  }

  try {
    let transaction: Transaction | null = null;
    switch (body.transaction_type) {
      case "Deposit":
        transaction = await deposit(body.src_account_number, body.amount);
        break;
      case "Withdrawal":
        transaction = await withdraw(body.src_account_number, body.amount);
        break;
      case "Transfer":
        if (!body.dest_account_number) {
          throw new ClientError("No destination account specified", 400);
        }
        transaction = await transfer(
          body.src_account_number,
          body.dest_account_number,
          body.amount,
        );
        break;
      case "Payment":
        break;
    }

    return Response.json(
      { data: transaction },
      {
        status: 201,
      },
    );
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
