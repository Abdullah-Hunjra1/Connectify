import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecomendedUsers, sendFriendRequest } from '../controllers/userController.js';

const router = express.Router();

router.use(protectRoute)

router.get('/', getRecomendedUsers)
router.get('/friends', getMyFriends)

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friend-requests' , getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

export default router;