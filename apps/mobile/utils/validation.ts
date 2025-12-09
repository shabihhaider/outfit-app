import { z } from "zod";

/**
 * Email validation schema
 * - Must be a valid email format
 */
export const emailSchema = z.string().email("Please enter a valid email address");

/**
 * Password validation schema
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - Special characters are optional but allowed
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * Username validation schema
 * - 3-30 characters
 * - Alphanumeric characters and underscores only
 * - Cannot start or end with underscore
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$/,
    "Username can only contain letters, numbers, and underscores (cannot start/end with underscore)"
  );

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;