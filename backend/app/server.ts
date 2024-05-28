import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import express from "express";
import cors from "cors";
import { User } from './entity/User';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { Role } from "./entity/Role";

const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "testdb",
  entities: [User, Role],
  synchronize: true,
};

createConnection(config)
  .then(async connection => {
    console.log("Connected to the database");

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api', userRoutes);

    // Start express server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.log("TypeORM connection error: ", error));
