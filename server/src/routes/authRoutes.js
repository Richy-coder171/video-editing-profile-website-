import express from 'express';
import { login, logout, me, register } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import requireDatabase from '../middleware/requireDatabase.js';

const router = express.Router();

router.post('/register', requireDatabase, register);
router.post('/login', requireDatabase, login);
router.post('/logout', logout);
router.get('/me', requireDatabase, protect, me);

export default router;
