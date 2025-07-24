import { z } from "zod";

export const registerBodySchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        username: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm password does not match",
        path: ["confirmPassword"],
    });

export type RegisterBody = z.infer<typeof registerBodySchema>;

export type RegisterDto = RegisterBody;
