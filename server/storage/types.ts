export interface Storage {
  uploadFile: (file: Express.Multer.File) => Promise<string>;
}
