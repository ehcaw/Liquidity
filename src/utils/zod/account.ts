import { z } from "zod";

export const PostAccountRequestBody = z.object({
  account_name: z.string(),
  account_type: z.enum(["Savings", "Checking"]),
});
