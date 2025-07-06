import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { errorResponse } from "src/core/utils/apiResponse";
import { toUpperUnderscore } from "src/core/utils/common";
import { ApiResponse } from "src/types/ApiResponse";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = "Unexpected error occurred";
        let errorCode: string = "INTERNAL_SERVER_ERROR";

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === "string") {
                message = res;
            } else {
                const resObj = res as Record<string, any>;
                message = resObj.message || exception.message;
                errorCode = toUpperUnderscore(resObj.error || HttpStatus[status]);
            }
        }

        if (exception instanceof PrismaClientValidationError) {
            message = "Error when creating entity";
            errorCode = toUpperUnderscore(HttpStatus[HttpStatus.UNPROCESSABLE_ENTITY]);
        }

        const error: ApiResponse<null> = errorResponse(message, errorCode, request.url);
        response.status(status).send(error);
    }
}
