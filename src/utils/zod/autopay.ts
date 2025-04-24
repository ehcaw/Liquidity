import { z } from "zod";

// Define the input type that will be used in the form
export const AutopayFormSchema = z.object({
  account_id: z.string().min(1, "Please select an account"),
  amount: z.string().min(1, "Amount is required"),  // Keep as string for form
  frequency: z.enum(["Daily", "Weekly", "Monthly", "Annually", "Once"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  day_of_week: z.string().optional(),
  day_of_month: z.string().optional(),  // Keep as string for form
  description: z.string().min(1, "Description is required"),
});

// Define the API request body schema with transformations
export const AutopayRequestBody = z.object({
  account_id: z.string(),
  amount: z.string().transform(v => parseFloat(v)), // Transform to number for API
  frequency: z.enum(["Daily", "Weekly", "Monthly", "Annually", "Once"]),
  start_date: z.string(),
  end_date: z.string(),
  day_of_week: z.string().optional(),
  day_of_month: z.string().optional().transform(v => v ? parseInt(v, 10) : undefined),
  day_of_year: z.string().optional(),
  description: z.string(),
});

export const AutopayUpdateRequestBody = z.object({
  status: z.enum(["Active", "Paused"]),
});

export type AutopayFormValues = z.infer<typeof AutopayFormSchema>;