import { User } from "@prisma/client";

export interface MeResponseDto extends Pick<User, "userId" | "username" | "email" | "profileUrl" | "createdAt"> {}
