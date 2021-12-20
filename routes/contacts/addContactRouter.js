import { Router } from 'express';
import { validateAdd } from '../../middlewares/contacts/validation';
import operations from '../../model/operations';

const addContactRouter = new Router();

addContactRouter.post('/', validateAdd, async (req, res, next) => {
    const add = await operations.addContact(req.body);
    res.status(201).json(add);
});

export default addContactRouter;
