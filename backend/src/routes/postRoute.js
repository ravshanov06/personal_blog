import { Router } from 'express';
import {getAllPosts, createPost, allPosts, togglePublish, editPost, updatePost, deletePost } from '../controllers/postsController.js';
import verifyJWT from '../middleware/auth.js'
import adminMiddleware from '../middleware/admin.js'
const posts = Router();

posts.get('/', getAllPosts);
posts.post('/', verifyJWT, adminMiddleware, createPost);
posts.get('/all', verifyJWT, adminMiddleware, allPosts);
posts.get('/:id', editPost);
posts.put('/:id/publish', verifyJWT, adminMiddleware, togglePublish);
posts.put('/:id', verifyJWT, adminMiddleware, updatePost);
posts.delete('/:id', verifyJWT, adminMiddleware, deletePost);

export default posts;