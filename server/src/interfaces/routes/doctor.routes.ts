import { Router } from 'express';
import { doctorController } from '../../infrastructure/container';
import { authMiddleware, requireDoctor } from '../middlewares/auth.middleware';
import { publicApiLimiter, searchApiLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Public routes with rate limiting
router.get('/', publicApiLimiter, doctorController.getAll);
router.get('/search', searchApiLimiter, doctorController.search); // Must be before /:id
router.get('/:id', publicApiLimiter, doctorController.getById);
router.get('/:id/schedule', publicApiLimiter, doctorController.getSchedule);
router.get('/:id/reviews', publicApiLimiter, doctorController.getReviews);

// Authenticated routes
router.post('/:id/reviews', authMiddleware, doctorController.createReview);

// Doctor-only routes
router.get('/profile/me', authMiddleware, requireDoctor, doctorController.getMyProfile);
router.post('/me/schedule', authMiddleware, requireDoctor, doctorController.saveSchedule);

export default router;
