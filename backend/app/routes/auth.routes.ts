import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    await signup(req, res);
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    await signin(req, res);
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
