import { HttpCode } from '../../lib/constants';
import AuthService from '../../service/users';
const usersService = new AuthService();

const signup = async (req, res, next) => {
    const { email } = req.body;
    const isUserExist = await usersService.isUserExist(email);
    if (isUserExist) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email is already exist',
        });
    }
    const data = await usersService.create(req.body);
    res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data,
    });
};

const login = async (req, res, next) => {
    console.log(req.body);

    res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {},
    });
};

const logout = async (req, res, next) => {
    console.log(req.body);

    res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {},
    });
};

export { signup, login, logout };
