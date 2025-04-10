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
    const now = Date.now();
    const { data: upload, error } = await supabase.storage
      .from("checks")
      .upload(`${userId}/check-${now}`, checkImage, {
        metadata: { userId: userId, uploadedAt: now },
      });
    if (error) {
      console.log(error.message);

      throw new ServerError("Check upload failed");
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(upload);
    const { data: url, error: signedUrlError } = await supabase.storage
      .from("checks")
      .createSignedUrl(upload.path, 3600);
    if (signedUrlError) {
      console.log(signedUrlError);
      throw new ServerError("Error creating an encrypted link for your check");
    }
    console.log("SIGNED URL", url.signedUrl);
    return Response.json({ uploadLink: url.signedUrl });
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
