import express from 'express';
import { createList, deleteList, editList, getList, savePost } from '../controllers/lists.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.get('/:listId', getList);

router.post('/createList', auth, createList);
router.delete('/deleteList/:listId', auth, deleteList);
router.patch('/editList', auth, editList);

router.patch('/savePost/:postId', auth, savePost);

export default router;