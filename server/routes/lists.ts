import express, { RequestHandler } from 'express';
import { createList, getList, savePost, removePost, donePost, getTitles, getPoint } from '../controllers/lists.ts';
import auth from '../middleware/auth.ts';

const router = express.Router();

router.get('/:listId', getList);

router.post('/createList', auth as unknown as RequestHandler, createList);

router.patch('/savePost/:postId', auth as unknown as RequestHandler, savePost);
router.patch('/removePost/:postId', auth as unknown as RequestHandler, removePost);
router.patch('/donePost/:postId', auth as unknown as RequestHandler, donePost);

router.get('/getTitles/:listId', getTitles)
router.get('/getPoint/:userId', getPoint);

export default router;
