import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DATABASE_CONFIGS } from "@/database";
import { WordModule } from "./word/word.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIGS),
    ConfigModule.forRoot(),
    HttpModule,
    WordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
