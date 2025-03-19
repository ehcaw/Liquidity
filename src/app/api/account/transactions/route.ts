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
