import { HttpCode } from '../../lib/constants';
import AuthService from '../../service/users';
const usersService = new AuthService();

const signup = async (req, res, next) => {
    const { email } = req.body;
    const isUserExist = await usersService.isUserExist(email);
    if (isUserExist) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'Conflict',
            code: HttpCode.CONFLICT,
            message: 'Email in use',
        });
    }
    const data = await usersService.create(req.body);

    res.status(HttpCode.CREATED).json({
        status: 'Created',
        code: HttpCode.CREATED,
        user: data,
    });
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
        status: 'success',
        code: HttpCode.OK,
        data: {},
    });
};

export { signup, login, logout };
