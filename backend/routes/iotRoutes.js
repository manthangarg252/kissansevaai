
import express from 'express';
import { getLiveStats, updateStats } from '../controllers/iotController.js';

const router = express.Router();

router.get('/live', getLiveStats);
router.post('/update', updateStats);

export default router;
