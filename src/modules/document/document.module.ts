import { Module } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { DocumentController } from "src/modules/document/document.controller";
import { DocumentService } from "src/modules/document/document.service";

@Module({
    controllers: [DocumentController],
    providers: [PrismaService, DocumentService],
})
export class DocumentModule {}
