import express from 'express';
import {
  sendMessage,
  sendMessageFromBot,
  updateMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.put('/:id/message', updateMessage);
router.post('/:id/message', sendMessage);
router.post('/:id/message/bot', sendMessageFromBot);

export default router;
