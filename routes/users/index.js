import { Router } from 'express';
import {
    signup,
    login,
    logout,
    currentUser,
    verifyUser,
    repeatEmailVerifyUser,
} from '../../controllers/users';

import uploadAvatar from '../../controllers/avatars';
import guard from '../../middlewares/users';
import limiter from '../../middlewares/rate-limit';
import { upload } from '../../middlewares/upload';

const router = new Router();

router.post('/signup', limiter(15 * 60 * 1000, 3), signup);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/current', guard, currentUser);
router.patch('/avatars', [guard, upload.single('avatar')], uploadAvatar);
router.get('/verify/:token', verifyUser);
router.post('/verify', repeatEmailVerifyUser);

export default router;
