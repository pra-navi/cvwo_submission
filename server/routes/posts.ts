import express from 'express';
import { getPosts, getPostsBySearch, getPostsByCreator, getPost, createPost, updatePost, deletePost, likePost, dislikePost, commentPost, getPostTitle } from '../controllers/posts';
import auth from '../middleware/auth';
import { RequestHandler } from 'express';

const router = express.Router();

router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/:id/getPostTitle', getPostTitle);

router.post('/', auth as unknown as RequestHandler, createPost);
router.patch('/:id', auth as unknown as RequestHandler, updatePost);
router.delete('/:id', auth as unknown as RequestHandler, deletePost);
router.patch('/:id/likePost', auth as unknown as RequestHandler, likePost);
router.patch('/:id/dislikePost', auth as unknown as RequestHandler, dislikePost);
router.post('/:id/commentPost', auth as unknown as RequestHandler, commentPost);


export default router;
