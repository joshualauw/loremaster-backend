export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: string;
    errorList?: string[];
    timestamp: string;
    path?: string;
}
