import { PrismaService } from "src/core/database/prisma.service";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "src/modules/user/user.service";
import { AuthModule } from "src/modules/auth/auth.module";

@Module({
    controllers: [UserController],
    providers: [PrismaService, UserService],
    imports: [AuthModule],
})
export class UserModule {}
