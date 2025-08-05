import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getConnectToken } from '../controllers/chatController.js';

const router = express.Router();

router.get('/token', protectRoute, getConnectToken);

export default router;