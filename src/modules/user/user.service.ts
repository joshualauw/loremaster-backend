import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { RegisterDto } from "src/modules/user/dtos/request/register.dto";
import { RegisterResponseDto } from "src/modules/user/dtos/response/register-response.dto";
import { AuthService } from "src/modules/auth/auth.service";
import { LoginDto } from "src/modules/user/dtos/request/login.dto";
import { LoginResponseDto } from "src/modules/user/dtos/response/login-response.dto";
import { pick } from "src/core/utils/mapper";
import { GoogleLoginDto } from "src/modules/user/dtos/request/google-login.dto";
import { GoogleLoginResponseDto } from "src/modules/user/dtos/response/google-login-response.dto";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) {}

    async register(payload: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, username } = payload;

        await this.prisma.user.findUniqueOrThrow({
            where: { email },
        });

        const hashedPassword = await this.authService.hashPassword(password);

        const newUser = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                provider: "LOCAL",
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
            user: pick(newUser, "userId", "email", "username", "createdAt"),
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
            user: pick(user, "userId", "email", "username"),
        };
    }

    async loginWithGoogle(payload: GoogleLoginDto): Promise<GoogleLoginResponseDto> {
        const { email, name, id, photoUrl } = payload;

        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    username: name,
                    password: "",
                    provider: "GOOGLE",
                    providerId: id,
                    profileUrl: photoUrl,
                },
            });
        }

        const token = this.authService.generateToken({
            sub: user.userId.toString(),
            id: user.userId,
            email: user.email,
            username: user.username,
        });

        return {
            token,
            user: pick(user, "userId", "email", "username", "createdAt"),
        };
    }
}
