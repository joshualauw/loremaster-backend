import { PipeTransform, ArgumentMetadata, BadRequestException, Paramtype } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(
        private schema: ZodSchema,
        private type: Paramtype = "body",
    ) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        if (metadata.type != this.type) return value;

        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (e) {
            if (e instanceof ZodError) {
                const errors = e.errors.map((zd) => `${zd.path} ${zd.message}`.toLowerCase());
                throw new BadRequestException(errors);
            }
            throw new BadRequestException("Validation failed");
        }
    }
}
