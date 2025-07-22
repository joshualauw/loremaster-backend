import { User } from "@prisma/client";

export interface GoogleLoginResponseDto {
    user: Pick<User, "userId" | "email" | "username" | "createdAt">;
    token: string;
}
