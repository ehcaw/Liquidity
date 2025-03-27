import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  const checkImage = formData.get("file");
  const userId = formData.get("userId") as string;

  if (!userId || userId.length == 0) {
    throw new ClientError("UserId not provided or invalid", 500);
  }

  if (!checkImage) {
    throw new ClientError("Invalid file", 500);
  }

  try {
    const { data: upload, error } = await supabase.storage
      .from("checks")
      .upload(`check-user_id=${userId}-${Date.now()}`, checkImage);
    if (error) {
      throw new ServerError("Check upload failed");
    }
    const { data: url, error: signedUrlError } = await supabase.storage
      .from("checks")
      .createSignedUrl(upload.path, 3600);
    if (signedUrlError) {
      throw new ServerError("Error creating an encrypted link for your check");
    }

    return Response.json({ url });
  } catch (error) {
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
    } else {
      return Response.json({ error: error }, { status: 500 });
    }
  }
}
