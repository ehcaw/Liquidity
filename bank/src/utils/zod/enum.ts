import { z } from "zod";

export const UserRoleEnum = z.enum(['User', 'Admin']);
export const UserStatusEnum = z.enum(['Active', 'Suspended', 'Deleted', 'Locked']);
export const AccountTypeEnum = z.enum(['Savings', 'Checking']);
export const AccountStatusEnum = z.enum(['Active', 'Frozen', 'Closed', 'Pending', 'Overdrawn']);
export const TransactionStatusEnum = z.enum(['Complete', 'Pending', 'Failed']);
export const TransactionTypeEnum = z.enum(['Withdrawal', 'Deposit', 'Transfer', 'Payment']);
export const ScheduleFrequencyEnum = z.enum(['Daily', 'Weekly', 'Monthly', 'Annually', 'Once']);
export const ScheduleStatusEnum = z.enum(['Active', 'Paused']);
export const DayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
export const LedgerCategoryEnum = z.enum(['Credit', 'Debit']);
