import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
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
        let errorList: string[] = [];

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === "string") {
                message = res;
            } else {
                const resObj = res as Record<string, any>;
                const msg = resObj?.message;
                if (Array.isArray(msg)) {
                    errorList = [...msg];
                } else {
                    message = typeof msg === "string" ? msg : exception.message;
                }
                errorCode = toUpperUnderscore(resObj.error || HttpStatus[status]);
            }
        }

        if (exception instanceof PrismaClientValidationError) {
            message = "Error when changing entity";
            errorCode = toUpperUnderscore(HttpStatus[HttpStatus.UNPROCESSABLE_ENTITY]);
        }

        if (exception instanceof PrismaClientKnownRequestError) {
            if (exception.code == "P2025") {
                status = HttpStatus.NOT_FOUND;
                message = "Entity not found";
                errorCode = toUpperUnderscore(HttpStatus[HttpStatus.NOT_FOUND]);

                const modelName = exception.meta?.modelName;
                if (typeof modelName === "string") {
                    errorList = [`${modelName.toLowerCase()} not found`];
                }
            } else if (exception.code == "P2002") {
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = "Entity unique violation";
                errorCode = toUpperUnderscore(HttpStatus[HttpStatus.UNPROCESSABLE_ENTITY]);

                const target = exception.meta?.target;
                if (Array.isArray(target)) {
                    errorList = target.map((m) => `${m} must be unique`);
                }
            }
        }

        const error: ApiResponse<null> = errorResponse(message, errorCode, request.url, errorList);
        response.status(status).send(error);
    }
}
