export interface LoginResponseDto {
    user: {
        id: number;
        email: string;
        username: string;
    };
    token: string;
}
