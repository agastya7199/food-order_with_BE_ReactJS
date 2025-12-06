import express from 'express';
import { getMeals } from '../controllers/mealsController.js';

const router = express.Router();

router.get('/', getMeals);

export default router;

