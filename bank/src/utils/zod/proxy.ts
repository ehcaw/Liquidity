import { z } from "zod";

export const PostProxyTransactionRequestBody = z.object({
  account_number: z.string(),
  amount: z.number(),
  transaction_type: z.enum(["Deposit", "Withdraw"])
});
