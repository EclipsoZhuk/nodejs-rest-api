import { Router } from 'express';
import { validateId } from '../../middlewares/contacts/validation';
import operations from '../../model/operations';

const removeRouter = new Router();

removeRouter.delete('/:id', validateId, async (req, res, next) => {
    const { id } = req.params;
    const contact = await operations.removeContact(id);

    if (contact) {
        return res.status(200).json({ message: 'Contact deleted' });
    }

    res.status(404).json({ message: 'Not found' });
});

export default removeRouter;
