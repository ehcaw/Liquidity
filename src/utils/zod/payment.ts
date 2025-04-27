import z from "zod";

export const CreatePaymentRequestBody = z
  .object({
    amount: z.number(),
    account_id: z.number(),
    start_date: z.string(),
    end_date: z.string(),
    frequency: z.enum(["Daily", "Weekly", "Monthly", "Annually", "Once"]),
    day_of_week: z
      .enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
      .nullable(),
    day_of_month: z.number().positive().min(1).max(28).nullable(),
    day_of_year: z.string().nullable(),
  })
  .refine((data) => {
    if (data.frequency === "Weekly" && !data.day_of_week) {
      return false;
    } else if (data.frequency === "Monthly" && !data.day_of_month) {
      return false;
    } else if (
      (data.frequency === "Annually" || data.frequency === "Once") &&
      !data.day_of_year
    ) {
      return false;
    }
    return true;
  });
