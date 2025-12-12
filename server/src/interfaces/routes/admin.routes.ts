import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';
import { adminPatientController, adminDoctorController, adminDashboardController } from '../../infrastructure/container';

const router = Router();

// Apply Auth and Admin check to all admin routes
router.use(authMiddleware, requireAdmin);

// Dashboard Routes
router.get('/stats', (req, res) => adminDashboardController.getStats(req, res));

// Patient Routes
router.get('/patients', (req, res) => adminPatientController.getAll(req, res));
router.get('/patients/:id', (req, res) => adminPatientController.getById(req, res));
router.post('/patients', (req, res) => adminPatientController.create(req, res));
router.put('/patients/:id', (req, res) => adminPatientController.update(req, res));
router.delete('/patients/:id', (req, res) => adminPatientController.delete(req, res));

// Doctor Routes
router.get('/doctors', (req, res) => adminDoctorController.getAll(req, res));
router.get('/doctors/:id', (req, res) => adminDoctorController.getById(req, res));
router.post('/doctors', (req, res) => adminDoctorController.create(req, res));
router.put('/doctors/:id', (req, res) => adminDoctorController.update(req, res));
router.delete('/doctors/:id', (req, res) => adminDoctorController.delete(req, res));

export default router;
