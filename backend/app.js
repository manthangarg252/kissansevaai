
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import livestockRoutes from './routes/livestockRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import carbonRoutes from './routes/carbonRoutes.js';
import traderRoutes from './routes/traderRoutes.js';
import iotRoutes from './routes/iotRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serving uploaded images as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/traders', traderRoutes);
app.use('/api/iot', iotRoutes);

export default app;
