import { createPaymentSchedule, getUserPaymentSchedules } from "@/services/banking/payment";
import { CreatePaymentRequestBody } from "@/utils/zod/payment";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const schedules = await getUserPaymentSchedules();

    return Response.json({ data: schedules }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = CreatePaymentRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      },
    );
  }

  try {
    const data = await createPaymentSchedule(body);
    return Response.json(
      { data },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: 500,
      },
    );
  }
}
