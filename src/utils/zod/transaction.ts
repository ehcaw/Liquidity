import { z } from "zod";

export const PostTransactionRequestBody = z.object({
  src_account_number: z.string(),
  dest_account_number: z.string().optional(),
  amount: z.number(),
  transaction_type: z.enum(["Deposit", "Withdrawal", "Transfer", "Payment"]),
});
