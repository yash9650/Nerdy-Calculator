import { join } from "path";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const DB_TYPE: "mysql" | "postgres" = "mysql";

let migrationPath = "./Migrations/*{.ts,.js}";

if (DB_TYPE === "mysql") {
  migrationPath = "./MySQL_Migrations/*{.ts,.js}";
}

const appDataSource = new DataSource({
  type: DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, "./Entities/*{.ts,.js}")],
  migrations: [join(__dirname, migrationPath)],
  synchronize: false,
});

export default appDataSource;
