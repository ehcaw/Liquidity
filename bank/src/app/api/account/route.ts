import { createAccount, getUserActiveAccounts, getUserAllAccounts } from "@/services/banking/account";
import { ClientError, ServerError } from "@/utils/exceptions";
import { PostAccountRequestBody } from "@/utils/zod/account";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status")
  try {
    let accounts;
    if (status === "active") {
      accounts = await getUserActiveAccounts();
    } else {
      accounts = await getUserAllAccounts();
    }

    return Response.json({ data: accounts });
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

export async function POST(req: NextRequest) {
  let body;
  try {
    body = PostAccountRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      },
    );
  }

  try {
    const newAccount = await createAccount(body.account_name, body.account_type);

    return Response.json({ data: newAccount }, {
      status: 201,
    });
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
