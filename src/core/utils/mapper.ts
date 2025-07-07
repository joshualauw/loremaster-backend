import { ClassConstructor, plainToInstance } from "class-transformer";

export function mapObject<T>(c: ClassConstructor<T>, obj: T) {
    return plainToInstance(c, obj, {
        excludeExtraneousValues: true,
    });
}
