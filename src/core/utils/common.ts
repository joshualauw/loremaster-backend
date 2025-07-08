export function toUpperUnderscore(input: string): string {
    return input.trim().replace(/\s+/g, "_").toUpperCase();
}
