
import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeCrop, getHistory } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
const router = express.Router();

router.post('/analyze', protect, upload.single('image'), analyzeCrop);
router.get('/history', protect, getHistory);

export default router;
