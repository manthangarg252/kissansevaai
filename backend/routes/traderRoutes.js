
import express from 'express';
import { getTraders, addTrader } from '../controllers/traderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTraders);
router.post('/add', protect, addTrader);

export default router;
