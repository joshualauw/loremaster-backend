import { User } from "@prisma/client";

export interface RegisterResponseDto {
    user: Pick<User, "userId" | "email" | "username"> & { createdAt: string };
    token: string;
}
