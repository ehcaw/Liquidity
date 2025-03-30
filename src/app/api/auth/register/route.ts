import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { RegisterRequestBody } from "@/utils/zod/auth";
import { userExists } from "@/services/auth/auth";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = RegisterRequestBody.parse(await req.json());
  } catch (error) {
    return Response.json({ error }, {
      status: 400,
    });
  }

  try {
    if (await userExists(body.email)) {
      return Response.json({ error: 'Email already exists' }, {
        status: 400,
      });
    }
    // sign up user
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: '/',
      }
    });

    if (authError) {
      throw authError;
    }

    // insert user into database
    const { password: _, ...user } = body;
    const { error: insertError } = await supabase.from('users').insert(user);

    if (insertError) {
      throw insertError;
    }

    const { data , error: selectError } = await supabase.from('users').select().eq('email', user.email);

    if (selectError) {
      throw selectError;
    }

    return Response.json({ data: data[0] }, {
      status: 201
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, {
      status: 500,
    });
  }
}
