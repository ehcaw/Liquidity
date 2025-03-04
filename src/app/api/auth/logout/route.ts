import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return Response.json({ data: null }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, {
      status: 500,
    });
  }
}
