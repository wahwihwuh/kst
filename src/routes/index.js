import { Router } from 'express';
import FoodMenuController from '../controllers/FoodMenuController';

const router = Router();

router.get('/', (req, res) => { FoodMenuController.getFoodMenu(req, res) });
router.post('/', (req, res) => { FoodMenuController.insertFoodMenu(req, res) });
router.patch('/', (req, res) => { FoodMenuController.updateFoodMenu(req, res) });
router.delete('/', (req, res) => { FoodMenuController.deleteFoodMenu(req, res) });

export default router;
