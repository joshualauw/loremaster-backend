export function toUpperUnderscore(input: string): string {
    return input.trim().replace(/\s+/g, "_").toUpperCase();
}

export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function snakeCaseNamingConverter(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(this.snakeCaseNamingConverter);
    } else if (obj !== null && typeof obj === "object") {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const snakeKey = toSnakeCase(key);
            acc[snakeKey] = this.snakeCaseNamingConverter(value);
            return acc;
        }, {} as any);
    } else {
        return obj;
    }
}
