import express from 'express';
import {
  createChat,
  deleteChat,
  getChats,
  getOneChat,
  updateChat,
} from '../controllers/chatController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getChats);
router.post('/', checkAuth, createChat);
router.get('/:id', checkAuth, getOneChat);
router.put('/:id', checkAuth, updateChat);
router.delete('/:id', checkAuth, deleteChat);

export default router;
