import { transferFunds } from "@/services/banking/account";
import { getAllTransactions } from "@/services/banking/transaction";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function GET() {
  try {
    const transactions = await getAllTransactions();
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

export async function PUT(req: Request) {
  const { amount, accountNumber } = await req.json();
  try {
    await transferFunds(accountNumber, amount);
    return Response.json({ data: null }, { status: 200 });
  } catch (error) {
    if (error instanceof ClientError) {
      console.log(error.message);
      return Response.json({ error: error.message }, { status: error.status });
    } else if (error instanceof ServerError) {
      console.log(error.message);
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
