import { createClient } from "@/utils/supabase/server";
import { SigninRequestBody } from "@/utils/zod/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let body;

  try {
    body = SigninRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json({ error }, {
      status: 400,
    });
  }

  const supabase = await createClient();

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (authError) {
      throw authError;
    }

    const { data , error: selectError } = await supabase
      .from('users')
      .select()
      .ilike('email', body.email);

    if (selectError) {
      throw selectError;
    }
    
    return Response.json({ data: data[0] }, {
      status: 200,
    });
  } catch (error) {
    return Response.json({ error }, {
      status: 500,
    });
  }
  
}
