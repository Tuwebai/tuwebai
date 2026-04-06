import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import contactRoutes from '../modules/contact/routes';
import newsletterRoutes from '../modules/newsletter/routes';
import testimonialsRoutes from '../modules/testimonials/routes';
import supportRoutes from '../modules/support/routes';
import projectsRoutes from '../modules/projects/routes';
import pulseRoutes from '../modules/pulse/routes';
import usersRoutes from '../modules/users/routes';
import performanceRoutes from '../modules/performance/routes';
import paymentRoutes from '../routes/payment.routes';

const router = Router();

router.use(authRoutes);
router.use(contactRoutes);
router.use(newsletterRoutes);
router.use(testimonialsRoutes);
router.use(supportRoutes);
router.use(projectsRoutes);
router.use(pulseRoutes);
router.use(usersRoutes);
router.use(performanceRoutes);
router.use(paymentRoutes);

export default router;
