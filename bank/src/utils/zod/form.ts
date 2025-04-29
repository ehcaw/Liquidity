"use client";

import { z } from "zod";

export const RegisterFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z
    .string()
    .length(5, "Zipcode must be exactly 5 digits")
    .regex(/^\d+$/, "Zipcode must contain only numbers"),
});

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ProfileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z
    .string()
    .length(5, "Zipcode must be exactly 5 digits")
    .regex(/^\d+$/, "Zipcode must contain only numbers"),
});

export const CreateAccountFormSchema = z.object({
  account_name: z.string().min(1, "Account name is required"),
  account_type: z.enum(["Checking", "Savings"]),
});

export const TransferFormSchema = z.object({
  fromAccount: z.string({
    required_error: "Please select an account to transfer from",
  }),
  toAccount: z.string({
    required_error: "Please select an account to transfer to",
  }),
  amount: z.number().refine(
    (val) => {
      return !isNaN(val) && val > 0;
    },
    {
      message: "Amount must be greater than 0",
    },
  ),
  confirmTransfer: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm the transfer details",
    }),
  }),
});

export const DepositFormSchema = z.object({
  toAccount: z.string({
    required_error: "Please select an account to deposit to",
  }),
  amount: z.number().refine(
    (val) => {
      return !isNaN(val) && val > 0;
    },
    {
      message: "Amount must be greater than 0",
    },
  ),
  confirmDeposit: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm the transfer details",
    }),
  }),
});

export const WithdrawFormSchema = z.object({
  fromAccount: z.string({
    required_error: "Please select an account to withdraw from",
  }),
  amount: z.number().refine(
    (val) => {
      return !isNaN(val) && val > 0;
    },
    {
      message: "Amount must be greater than 0",
    },
  ),
  confirmWithdrawal: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm the transfer details",
    }),
  }),
});
