import { Router } from 'express';
import { signup, login, logout } from '../../controllers/users';
import guard from '../../middlewares/users';

const router = new Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', guard, logout);

export default router;
