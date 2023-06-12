import express from 'express';
import { login, signup, getUser } from '../controllers/user.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/profile/:id', getUser);

export default router;