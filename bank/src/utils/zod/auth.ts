import { z } from "zod";

export const RegisterRequestBody = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
});

export const SigninRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
