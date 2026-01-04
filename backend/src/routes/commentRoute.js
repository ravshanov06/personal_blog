import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/commentController.js';
import verifyJWT from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = Router();

router.get('/', verifyJWT, adminMiddleware, getAllComments);

router.post('/', verifyJWT, createComment);

router.delete('/:id', verifyJWT, adminMiddleware, deleteComment);

export default router;