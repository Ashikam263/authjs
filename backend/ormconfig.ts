import { ConnectionOptions } from "typeorm";
import { User } from './app/entity/User';
import { Role } from "./app/entity/Role";

const config: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "testdb",
  synchronize: true,
  logging: false,
  entities: [User, Role],
  migrations: [],
  subscribers: [],
};

export default config;
