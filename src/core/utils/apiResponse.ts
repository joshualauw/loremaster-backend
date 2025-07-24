import { ApiResponse } from "src/types/api-response";

export function apiResponse<T>(message: string, data?: T): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

export function errorResponse<T>(
    message: string,
    errorCode: string,
    path: string,
    errorList?: string[],
): ApiResponse<T> {
    return {
        success: false,
        message,
        errorCode,
        errorList,
        timestamp: new Date().toISOString(),
        path,
    };
}
