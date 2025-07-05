export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: string;
    timestamp: string;
    path?: string;
}
