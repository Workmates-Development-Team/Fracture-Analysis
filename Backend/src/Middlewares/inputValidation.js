import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),

  password :  z.string({
    required_error: "Password is required",
  }).regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character"
  ),
  age: z.string().min(0, 'Age must be a positive integer'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
  }),
  
  
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});