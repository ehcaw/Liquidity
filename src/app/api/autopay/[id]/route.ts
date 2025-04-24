// src/app/api/autopay/[id]/route.ts
import { getAuthUser } from "@/services/auth/auth";
import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { AutopayUpdateRequestBody } from "@/utils/zod/autopay";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body;
  
  try {
    body = AutopayUpdateRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      },
    );
  }

  try {
    const supabase = await createClient();
    const authUser = await getAuthUser();

    // Verify ownership
    const { data: schedule, error: scheduleError } = await supabase
      .from("payment_schedule")
      .select(`
        *,
        accounts!inner(user_id)
      `)
      // .eq("id", id)
      .eq("id", Number(id) || 0)
      .eq("accounts.user_id", authUser.id)
      .single();

    if (scheduleError || !schedule) {
      throw new ClientError("Schedule not found or access denied", 403);
    }

    // Update the schedule
    const { error: updateError } = await supabase
      .from("payment_schedule")
      .update({ status: body.status })
      // .eq("id", id);
      .eq("id", Number(id))

    if (updateError) {
      throw new ServerError(updateError.message);
    }

    return new Response(null, { status: 204 });
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

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const authUser = await getAuthUser();

    // Verify ownership
    const { data: schedule, error: scheduleError } = await supabase
      .from("payment_schedule")
      .select(`
        *,
        accounts!inner(user_id)
      `)
      // .eq("id", id)
      .eq("id", Number(id))
      .eq("accounts.user_id", authUser.id)
      .single();

    if (scheduleError || !schedule) {
      throw new ClientError("Schedule not found or access denied", 403);
    }

    // Delete the schedule
    const { error: deleteError } = await supabase
      .from("payment_schedule")
      .delete()
      // .eq("id", id);
      .eq("id", Number(id))

    if (deleteError) {
      throw new ServerError(deleteError.message);
    }

    return new Response(null, { status: 204 });
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