import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("states").select();

    if (error) {
      throw error;
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, {
      status: 500,
    });
  }
}
