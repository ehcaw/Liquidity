import { setAccountPinCode } from "@/services/banking/account";
import { PostAccountPinCodeRequestBody } from "@/utils/zod/account";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ account_number: string }> },
) {
  let body;
  const { account_number } = await params;
  try {
    body = PostAccountPinCodeRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      },
    );
  }

  try {
    await setAccountPinCode(account_number, body.pin_code);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error },
      {
        status: 500,
      },
    );
  }
}
