import { Expose } from "class-transformer";

export class FindAllByUserDto {
    @Expose()
    storyId: number;

    @Expose()
    userId: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    logoUrl: string | null;
}
