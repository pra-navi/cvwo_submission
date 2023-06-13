import express from 'express';
import { login, signup, getUser, savePost } from '../controllers/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/profile/:id', getUser);

router.patch('/savePost/:postId', auth, savePost);

export default router;