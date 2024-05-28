import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Role } from "../entity/Role";

export const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);
    const userByUsername = await userRepository.findOne({ where: { username: req.body.username } });
    const userByEmail = await userRepository.findOne({ where: { email: req.body.email } });

    if (userByUsername) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    if (userByEmail) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
};

export const checkRolesExisted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleRepository = getRepository(Role);
    const roles = await roleRepository.find();
    const requestedRoles = req.body.roles;

    if (requestedRoles) {
      for (let i = 0; i < requestedRoles.length; i++) {
        const roleExists = roles.some(role => role.name === requestedRoles[i]);
        if (!roleExists) {
          return res.status(400).send({ message: `Failed! Role does not exist: ${requestedRoles[i]}` });
        }
      }
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
};