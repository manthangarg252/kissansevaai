
import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeLivestock } from '../controllers/livestockController.js';
import { protect } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const router = express.Router();

router.post('/analyze', protect, upload.single('image'), analyzeLivestock);

export default router;
