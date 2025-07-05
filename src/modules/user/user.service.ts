import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { RegisterDto } from "src/modules/user/dto/register.dto";
import * as bcrypt from "bcrypt";
import { RegisterResponseDto } from "src/modules/user/dto/register-response.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async register(payload: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, username } = payload;

        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                credit: 0,
                createdAt: new Date().toISOString(),
            },
        });

        return {
            id: newUser.userId,
            email: newUser.email,
            username: newUser.username,
            createdAt: newUser.createdAt.toISOString(),
        };
    }
}
