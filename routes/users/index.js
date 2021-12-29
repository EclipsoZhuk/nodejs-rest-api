import { Router } from 'express';
import { signup, login, logout } from '../../controllers/users';

const router = new Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
