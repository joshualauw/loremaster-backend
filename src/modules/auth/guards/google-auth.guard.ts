import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthStrategy } from "src/modules/auth/enum/AuthStrategy";

@Injectable()
export class GoogleAuthGuard extends AuthGuard(AuthStrategy.GOOGLE) {}
