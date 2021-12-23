import Contact from '../../model/contact';

const listContacts = async () => await Contact.find();

const addContact = async body => await Contact.create(body);

const getContactById = async contactId => await Contact.findById(contactId);

const removeContact = async contactId =>
    await Contact.findByIdAndRemove(contactId);

const updateContact = async (contactId, body) => {
    const result = await Contact.findByIdAndUpdate(
        contactId,
        { ...body },
        { new: true },
    );
    return result;
};

export default {
    listContacts,
    addContact,
    getContactById,
    removeContact,
    updateContact,
};
