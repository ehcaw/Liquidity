import { z } from "zod";

export const ProfileRequestBody = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string()
});
