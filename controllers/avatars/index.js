/* eslint-disable no-unused-vars */
import { HttpCode } from '../../lib/constants';
import {
    UploadFileService,
    // LocaleFileStorage,
    CloudFileStorage,
} from '../../service/fileStorage';

const uploadAvatar = async (req, res, next) => {
    const uploadService = new UploadFileService(
        CloudFileStorage,
        req.user,
        req.file,
    );

    const avatarUrl = await uploadService.updateAvatar();

    res.status(HttpCode.OK).json({
        status: 'OK',
        code: HttpCode.OK,
        data: { avatarUrl },
    });
};

export default uploadAvatar;
