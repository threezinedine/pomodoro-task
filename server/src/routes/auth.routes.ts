import { Router } from 'express';
import { googleLogin, logout, mockLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/google', googleLogin);
router.post('/logout', logout);

// Only expose the mock route if we are in development or testing.
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  router.post('/mock', mockLogin);
}

export default router;
