import express from 'express';
import { createList, deleteList } from '../controllers/lists.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.post('/createList', auth, createList);
router.delete('/deleteList/:listId', auth, deleteList);

export default router;