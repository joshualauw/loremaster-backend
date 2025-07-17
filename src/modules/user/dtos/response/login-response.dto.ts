import { User } from "@prisma/client";

export interface LoginResponseDto {
    user: Pick<User, "userId" | "email" | "username">;
    token: string;
}
