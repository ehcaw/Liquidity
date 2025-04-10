import { z } from "zod";

export const TransactionRequestBody = z.object({
    serial: z.number(),
    created_at: z.number(),
    amount: z.number(),
    description: z.string(),
    balance: z.number(),
    status: z.enum(['Complete', 'Pending', 'Failed']),
    transaction_type: z.enum(['Withdrawal', 'Deposit', 'Transfer', 'Payment']),
    account_id: z.number()
});