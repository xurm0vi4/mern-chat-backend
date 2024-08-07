import express from 'express';
import { login, getUserInfo, signup } from '../controllers/authController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', checkAuth, getUserInfo);

export default router;
