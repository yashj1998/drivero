import express from 'express';
import { getCars, getCar, createCar, updateCar, deleteCar } from '../controllers/carController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCars);
router.get('/:identifier', getCar);
router.post('/', protectAdmin, createCar);
router.put('/:id', protectAdmin, updateCar);
router.delete('/:id', protectAdmin, deleteCar);

export default router;
