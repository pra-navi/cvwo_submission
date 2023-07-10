import express from 'express';
import { login, signup, getUser, changePrivacy, googleLogin } from '../controllers/user.js';
import auth from '../middleware/auth.js';
import User from '../models/user.js';


const router = express.Router();

router.post('/googleLogin', googleLogin);
router.post('/login', login);
router.post('/signup', signup);
router.get('/profile/:id', getUser);
router.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
      // Find the user with the matching verification token
      const user = await User.findOne({ verificationToken: token });
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid verification token' });
      }
  
      // Mark the email as verified and remove the verification token
      user.isEmailVerified = true;
      user.verificationToken = undefined;
      await user.save();
  
      // Redirect the user to the login page or display a success message
      res.redirect('/login');
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
});
/*
router.patch('/savePost/:postId', auth, savePost);
router.patch('/donePost/:postId', auth, donePost);
*/
router.patch('/changePrivacy', auth, changePrivacy);


export default router;