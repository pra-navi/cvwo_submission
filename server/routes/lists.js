import express from 'express';
import { createList } from '../controllers/lists.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.post('/createList/:listName', auth, createList);

export default router;