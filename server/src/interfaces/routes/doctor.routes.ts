import { Router } from 'express';
import { doctorController } from '../../infrastructure/container';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', doctorController.getAll);
router.get('/search', doctorController.search); // Must be before /:id
router.get('/:id', doctorController.getById);
router.get('/:id/schedule', doctorController.getSchedule);
router.get('/:id/reviews', doctorController.getReviews);
router.post('/:id/reviews', authMiddleware, doctorController.createReview);

export default router;
