import { z } from "zod";
import { AccountStatusEnum, AccountTypeEnum, DayEnum, LedgerCategoryEnum, ScheduleFrequencyEnum, ScheduleStatusEnum, TransactionStatusEnum, TransactionTypeEnum, UserRoleEnum, UserStatusEnum } from "@/utils/zod/enum";

export const State = z.object({
  code: z.string(),
  name: z.string(),
});

export const User = z.object({
  id: z.number(),
  created_at: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: UserRoleEnum.default('User'),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  status: UserStatusEnum.default('Active'),
});

export const Account = z.object({
  id: z.number(),
  created_at: z.string(),
  account_number: z.string(),
  account_type: AccountTypeEnum,
  balance: z.number(),
  status: AccountStatusEnum.default('Pending'),
  user_id: z.number(),
});

export const Transaction = z.object({
  id: z.number(),
  created_at: z.string(),
  amount: z.number(),
  description: z.string(),
  balance: z.number(),
  status: TransactionStatusEnum.default('Pending'),
  transaction_type: TransactionTypeEnum,
  account_id: z.number(),
});

export const PaymentSchedule = z.object({
  id: z.number(),
  created_at: z.string(),
  amount: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  status: ScheduleStatusEnum.default('Active'),
  frequency: ScheduleFrequencyEnum,
  day_of_week: DayEnum.nullable(),
  day_of_month: z.number().nullable(),
  day_of_year: z.string().nullable(),
  account_id: z.number(),
});

export const Ledger = z.object({
  id: z.number(),
  created_at: z.string(),
  amount: z.number(),
  description: z.string(),
  entry_category: LedgerCategoryEnum,
  balance: z.number(),
  account_id: z.number(),
  transaction_id: z.number(),
});
