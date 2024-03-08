import { DataSourceOptions } from "typeorm";
import entitys from "./entitys";

export const DATABASE_CONFIGS = {
  type: process.env.DATABASE_TYPE || "postgres",
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "secret",
  database: process.env.DATABASE_NAME || "wolof",
  port: process.env.DATABASE_PORT || 5433,
  host: process.env.DATABASE_HOST || "localhost",

  synchronize: true,
  logging: false,
  autoLoadEntities: true,
  entities: entitys,
} as DataSourceOptions;
