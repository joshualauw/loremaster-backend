import { ApiResponse } from "src/types/ApiResponse";

export function apiResponse<T>(message: string, data?: T): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

export function errorResponse<T>(message: string, errorCode: string, path: string): ApiResponse<T> {
    return {
        success: false,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
        path,
    };
}
