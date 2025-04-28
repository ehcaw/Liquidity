import { createClient } from "@/utils/supabase/server";
import { ProfileRequestBody } from "@/utils/zod/profile";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw authError;
    }
  
    const sessionUser = data.session?.user;
    if (!sessionUser) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: user, error: selectError } = await supabase.from('users').select().eq('email', sessionUser.email || "");

    if (selectError) {
      throw selectError;
    }

    return Response.json({ data: user[0] }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  let body;
  try {
    body = ProfileRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json({ error }, {
      status: 400,
    });
  }

  try {
    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw authError;
    }
  
    const sessionUser = data.session?.user;
    if (!sessionUser) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { error: updateError } = await supabase.from('users').update(body).eq('email', sessionUser.email || "");

    if (updateError) {
      throw updateError;
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json({ error }, {
      status: 500,
    });
  }
}
