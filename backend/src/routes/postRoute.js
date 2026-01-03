import { Router } from 'express';
import {getAllPosts, createPost } from '../controllers/postsController.js';
import verifyJWT from '../middleware/auth.js'
const posts = Router();

posts.get('/', getAllPosts);
posts.post('/', verifyJWT, createPost);

export default posts;