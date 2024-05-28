import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import { In } from 'typeorm';


export const signup = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const roleRepository = getRepository(Role);

    const { username, email, password, roles } = req.body;

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = bcrypt.hashSync(password, 8);

    await userRepository.save(user);

    if (roles) {
      const userRoles = await roleRepository.find({
        where: {
          name: In(roles),
        },
      });
      user.roles = userRoles;
    } else {
      const defaultRole = await roleRepository.findOne({ where: { name: 'user' } });
      if (defaultRole) {
        user.roles = [defaultRole];
}
    }

    await userRepository.save(user);
    res.send({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const { username, password } = req.body;

    const user = await userRepository.findOne({ where: { username }, relations: ['roles'] });

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    const authorities = user.roles.map(role => 'ROLE_' + role.name.toUpperCase());

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
