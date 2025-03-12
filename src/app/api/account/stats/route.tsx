import { getAllAccountStats } from "@/services/banking/account";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function GET() {
  try {
    const stats = await getAllAccountStats();
    return Response.json({ data: stats });
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
