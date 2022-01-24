import { HttpCode } from '../../lib/constants';
import usersService from '../../service/users';
import {
    EmailService,
    SenderSendgrid,
    SenderNodemailer,
} from '../../service/email';

import repositoryUsers from '../../repository/users';

const signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        const isUserExist = await usersService.isUserExist(email);
        if (isUserExist) {
            return res.status(HttpCode.CONFLICT).json({
                status: 'Conflict',
                code: HttpCode.CONFLICT,
                message: 'Email in use',
            });
        }
        const userData = await usersService.create(req.body);
        const emailService = new EmailService(
            process.env.NODE_ENV,
            new SenderSendgrid(),
        );

        const isSend = await emailService.sendVerifyEmail(
            email,
            userData.name,
            userData.verifyTokenEmail,
        );
        delete emailService.sendVerifyEmail;

        res.status(HttpCode.CREATED).json({
            status: 'Created',
            code: HttpCode.CREATED,
            user: { ...userData, isSendEmailVerify: isSend },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await usersService.getUser(email, password);
    if (!user) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'Unauthorized',
            code: HttpCode.UNAUTHORIZED,
            message: 'Email or password is wrong',
        });
    }
    const token = usersService.getToken(user);
    await usersService.setToken(user.id, token);
    const { subscription } = user;

    res.status(HttpCode.OK).json({
        status: 'OK',
        code: HttpCode.OK,
        data: { token, user: { email, subscription } },
    });
};

const logout = async (req, res, next) => {
    await usersService.setToken(req.user.id, null);

    res.status(HttpCode.NO_CONTENT).json({
        status: 'OK',
        code: HttpCode.OK,
        data: {},
    });
};

const currentUser = async (req, res) => {
    const { _id: userId } = req.user;
    const user = await usersService.current(userId);
    if (!user) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'Unauthorized',
            code: HttpCode.UNAUTHORIZED,
            message: 'Not authorized',
        });
    }
    res.status(HttpCode.OK).json({
        status: 'OK',
        data: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const verifyUser = async (req, res, next) => {
    const verifyToken = req.params.token;
    const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken);

    if (userFromToken) {
        await repositoryUsers.updateVerify(userFromToken.id, true);
        return res.status(HttpCode.OK).json({
            status: 'OK',
            code: HttpCode.OK,
            data: { message: 'Verification successful' },
        });
    }

    res.status(HttpCode.NOT_FOUND).json({
        status: 'success',
        code: HttpCode.NOT_FOUND,
        data: { message: 'User not found' },
    });
};

const repeatEmailVerifyUser = async (req, res, next) => {
    const { email } = req.body;
    const user = await repositoryUsers.findByEmail(email);

    if (user) {
        const { email, name, verifyTokenEmail } = user;
        const emailService = new EmailService(
            process.env.NODE_ENV,
            new SenderNodemailer(),
        );

        const isSend = await emailService.sendVerifyEmail(
            email,
            name,
            verifyTokenEmail,
        );
        if (isSend) {
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification email sent' },
            });
        }
        return res.status(HttpCode.SE).json({
            status: 'error',
            code: HttpCode.SE,
            data: { message: 'Service Unavailable' },
        });
    }

    res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: { message: 'User with email not found' },
    });
};

export {
    signup,
    login,
    logout,
    currentUser,
    verifyUser,
    repeatEmailVerifyUser,
};
