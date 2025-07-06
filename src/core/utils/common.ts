export function toUpperUnderscore(input: string): string {
    return input.trim().replace(/\s+/g, "_").toUpperCase();
}

export function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
    const { [key]: _, ...rest } = obj;
    return rest;
}

export function omitMany<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, key: K): Pick<T, K> {
    return { [key]: obj[key] } as Pick<T, K>;
}

export function pickMany<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
