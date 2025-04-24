import { promoteAdmin } from "@/services/auth/auth";

export async function PUT() {
  try {
    await promoteAdmin();
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 500,
      },
    );
  }
}
