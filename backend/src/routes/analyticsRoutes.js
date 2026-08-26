import express from 'express';
import { getAnalyticsDashboard } from '../controllers/analyticsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protectAdmin, getAnalyticsDashboard);

export default router;
