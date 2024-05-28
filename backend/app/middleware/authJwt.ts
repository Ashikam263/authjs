import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import config from "../config/auth.config";

// Extend the Request interface to include userId property
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = (decoded as any).id; // Type assertion to avoid TypeScript error
    next();
  });
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.userId }, relations: ["roles"] });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    console.log('User:', user);
    console.log('Roles:', user.roles);

    if (user.roles.some(role => role.name === "admin")) {
      return next();
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    console.error('Error in isAdmin middleware:', err);
    res.status(500).send({ message: "Unable to validate Admin role!" });
  }
};


export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.userId }, relations: ["roles"] });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.roles.some(role => role.name === "moderator")) {
      return next();
    }

    res.status(403).send({ message: "Require Moderator Role!" });
  } catch (err) {
    res.status(500).send({ message: "Unable to validate Moderator role!" });
  }
};

export const isModeratorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.userId }, relations: ["roles"] });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.roles.some(role => role.name === "moderator" || role.name === "admin")) {
      return next();
    }

    res.status(403).send({ message: "Require Moderator or Admin Role!" });
  } catch (err) {
    res.status(500).send({ message: "Unable to validate Moderator or Admin role!" });
  }
};
