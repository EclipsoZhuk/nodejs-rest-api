import { jest } from '@jest/globals';
import { signup } from './index';
import { HttpCode } from '../../lib/constants';
import usersService from '../../service/users';

// jest.mock('../../service/users');

describe('Unit test signup', () => {
    let req, res, next;
    beforeEach(() => {
        req = { body: { email: 'test@test.com', password: '12345678' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(data => data),
        };
        next = jest.fn();
        usersService.create = jest.fn(async data => data);
    });

    test('Signup new User', async () => {
        usersService.isUserExist = jest.fn(async () => false);
        await signup(req, res, next);
        expect(usersService.isUserExist).toHaveBeenCalledWith(req.body.email);
        expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED);
    });

    test('Signup already exist User', async () => {
        usersService.isUserExist = jest.fn(async () => true);
        await signup(req, res, next);
        expect(usersService.isUserExist).toHaveBeenCalledWith(req.body.email);
        expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT);
    });

    test('Signup with error database', async () => {
        const testError = new Error('Database Error');
        usersService.isUserExist = jest.fn(async () => {
            throw testError;
        });
        await signup(req, res, next);
        expect(usersService.isUserExist).toHaveBeenCalledWith(req.body.email);
        expect(next).toHaveBeenCalledWith(testError);
    });
});
