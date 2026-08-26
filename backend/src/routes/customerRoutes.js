import express from 'express';
import { getCustomers, getCustomerById, updateCustomer } from '../controllers/customerController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protectAdmin); // All customer endpoints require admin authentication

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);

export default router;
