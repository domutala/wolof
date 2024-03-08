import { Module } from "@nestjs/common";
import { WordController } from "./word.controller";
import { WordService } from "./word.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DATABASE_CONFIGS } from "src/database";
import { Word } from "src/database/entitys/Word";
import { WordRepository } from "src/database/repositorys/Word";

@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIGS),
    ConfigModule.forRoot(),
    HttpModule,
  ],
  controllers: [WordController],
  providers: [WordService, Word, WordRepository],
})
export class WordModule {}
