import { Router } from 'express';
import { signup, login, logout, currentUser } from '../../controllers/users';
import guard from '../../middlewares/users';
import limiter from '../../middlewares/rate-limit';

const router = new Router();

router.post('/signup', limiter(15 * 60 * 1000, 3), signup);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/current', guard, currentUser);

export default router;
