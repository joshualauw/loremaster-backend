export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        //@ts-ignore
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
