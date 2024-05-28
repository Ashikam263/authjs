import { createConnection, Connection } from "typeorm";
import { User } from "../entity/User";
import { Role } from "../entity/Role";

const connectDatabase = async (): Promise<Connection> => {
  try {
    const connection = await createConnection();
    console.log("Connected to the database");

    // Initialize roles if they don't exist
    const roleRepository = connection.getRepository(Role);
    const roles = await roleRepository.find();

    if (roles.length === 0) {
      await roleRepository.save([
        roleRepository.create({ name: "user" }),
        roleRepository.create({ name: "moderator" }),
        roleRepository.create({ name: "admin" }),
      ]);
      console.log("Roles initialized");
    }

    return connection;
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw error;
  }
};

export { connectDatabase, User, Role };
