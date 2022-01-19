import path from 'path';
import fs from 'fs/promises';
import Users from '../../repository/users';

class LocaleStorage {
    constructor(file, user) {
        this.userId = user.id;
        this.filename = file.filename;
        this.filePath = file.path;
        this.folderPublic = process.env.FOLDER_PUBLIC;
        this.folderAvatars = process.env.FOLDER_FOR_AVATARS;
    }

    async save() {
        const destination = path.join(
            this.folderPublic,
            this.folderAvatars,
            this.userId,
        );

        await fs.mkdir(destination, { recursive: true });

        const files = await fs.readdir(destination);
        if (files.length > 0) {
            files.map(filename => fs.unlink(`${destination}/${filename}`));
        }

        await fs.rename(this.filePath, path.join(destination, this.filename));

        const avatarUrl = path.normalize(
            path.join(this.folderAvatars, this.userId, this.filename),
        );

        await Users.updateAvatar(this.userId, avatarUrl);
        return avatarUrl;
    }
}

export default LocaleStorage;
