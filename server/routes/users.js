import express from 'express';
import { login, signup, getUser, savePost, donePost, changePrivacy, googleLogin } from '../controllers/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/googleLogin', googleLogin);
router.post('/login', login);
router.post('/signup', signup);
router.get('/profile/:id', getUser);

router.patch('/savePost/:postId', auth, savePost);
router.patch('/donePost/:postId', auth, donePost);
router.patch('/changePrivacy', auth, changePrivacy);

export default router;