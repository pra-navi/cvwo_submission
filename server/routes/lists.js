import express from 'express';
import { createList, deleteList, editList, getList, savePost, removePost, donePost, getTitles, getPoint } from '../controllers/lists.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.get('/:listId', getList);

router.post('/createList', auth, createList);
router.delete('/deleteList/:listId', auth, deleteList);
router.patch('/editList', auth, editList);

router.patch('/savePost/:postId', auth, savePost);
router.patch('/removePost/:postId', auth, removePost);
router.patch('/donePost/:postId', auth, donePost);

router.get('/getTitles/:listId', getTitles)
router.get('/getPoint/:userId', getPoint);

export default router;