import { Router } from 'express';
import contactRoutes from '../modules/contact/routes';
import newsletterRoutes from '../modules/newsletter/routes';
import testimonialsRoutes from '../modules/testimonials/routes';
import supportRoutes from '../modules/support/routes';
import projectsRoutes from '../modules/projects/routes';
import usersRoutes from '../modules/users/routes';
import paymentRoutes from '../routes/payment.routes';

const router = Router();

router.use(contactRoutes);
router.use(newsletterRoutes);
router.use(testimonialsRoutes);
router.use(supportRoutes);
router.use(projectsRoutes);
router.use(usersRoutes);
router.use(paymentRoutes);

export default router;
