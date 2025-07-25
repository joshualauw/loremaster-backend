import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) {}

    generateToken(payload: { sub: string; id: number; email: string; username: string }): string {
        return this.jwt.sign(payload);
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, realPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, realPassword);
    }
}
