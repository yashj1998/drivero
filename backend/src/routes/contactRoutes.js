import express from 'express';
import { submitContact, getInquiries } from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protectAdmin, getInquiries);

export default router;
