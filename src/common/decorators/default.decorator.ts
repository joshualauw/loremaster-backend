import { Transform } from "class-transformer";

export const Default = <T>(defaultValue: T) => Transform(({ value }) => (value !== undefined ? value : defaultValue));
