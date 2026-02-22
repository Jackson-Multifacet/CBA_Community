import { Storage } from './types';

export const localStorage: Storage = {
  uploadFile: async (file: Express.Multer.File) => {
    return `/uploads/${file.filename}`;
  }
};
