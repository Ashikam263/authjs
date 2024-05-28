// interface DbConfig {
//   HOST: string;
//   USER: string;
//   PASSWORD: string;
//   DB: string;
//   dialect: string;
//   pool: {
//     max: number;
//     min: number;
//     acquire: number;
//     idle: number;
//   };
// }

// const dbConfig: DbConfig = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "password",
//   DB: "testdb",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

// export default dbConfig;

import { ConnectionOptions } from "typeorm";
import { User } from '../entity/User';
import { Role } from "../entity/Role";

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
