import { z } from "zod";

/** Amount for credits/transfers: finite number, not negative, and greater than zero. */
export const monetaryAmountSchema = z
  .number()
  .finite({ message: "Amount must be a finite number" })
  .refine((n) => n >= 0, { message: "Amount cannot be negative" })
  .refine((n) => n > 0, { message: "Amount must be greater than zero" });
