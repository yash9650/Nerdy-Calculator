import { join } from "path";
import { DataSource } from "typeorm";
import * as fs from "fs";
import { config } from "dotenv";

config();

const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(join(__dirname, "/../../root.crt")).toString(),
  },
  entities: [join(__dirname, "./Entities/*{.ts,.js}")],
  migrations: [join(__dirname, "./Migrations/*{.ts,.js}")],
  synchronize: false,
});

export default appDataSource;
