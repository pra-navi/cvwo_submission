import express from 'express';
import { login, signup, getUser, changePrivacy } from '../controllers/users';
import auth from '../middleware/auth';
import { getUserQuery, updateVerificationTokenQuery } from '../../server/models/userQueries'
import pool from '../../server/models/db';
import { RequestHandler } from 'express';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/profile/:id', getUser);

router.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
        const getUserResult = await pool.query(getUserQuery, [token]);

        if (getUserResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid verification token' });
        }

        const user = getUserResult.rows[0];

        await pool.query(updateVerificationTokenQuery, [user.id]);  
        res.redirect('/login');
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
});

router.patch('/profileSetting', auth as unknown as RequestHandler, changePrivacy);


export default router;