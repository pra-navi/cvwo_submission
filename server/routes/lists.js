import express from 'express';
import { createList, deleteList, editList, getList } from '../controllers/lists.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.get('/:listId', getList);

router.post('/createList', auth, createList);
router.delete('/deleteList/:listId', auth, deleteList);
router.patch('/editList', auth, editList);

export default router;