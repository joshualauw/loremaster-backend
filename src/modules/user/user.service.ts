import { Injectable, ConflictException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { RegisterDto } from "src/modules/user/dtos/register.dto";
import { RegisterResponseDto } from "src/modules/user/dtos/register-response.dto";
import { AuthService } from "src/modules/auth/auth.service";
import { LoginDto } from "src/modules/user/dtos/login.dto";
import { LoginResponseDto } from "src/modules/user/dtos/login-response.dto";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) {}

    async register(payload: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, username } = payload;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException("Email already in use");
        }

        const hashedPassword = await this.authService.hashPassword(password);

        const newUser = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                credit: 0,
            },
        });

        const token = this.authService.generateToken({
            sub: newUser.userId.toString(),
            id: newUser.userId,
            email: newUser.email,
            username: newUser.username,
        });

        return {
            token,
            user: {
                userId: newUser.userId,
                email: newUser.email,
                username: newUser.username,
                createdAt: newUser.createdAt.toISOString(),
            },
        };
    }

    async login(payload: LoginDto): Promise<LoginResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isMatch = await this.authService.comparePassword(payload.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = this.authService.generateToken({
            sub: user.userId.toString(),
            id: user.userId,
            email: user.email,
            username: user.username,
        });

        return {
            token,
            user: {
                userId: user.userId,
                email: user.email,
                username: user.username,
            },
        };
    }
}
