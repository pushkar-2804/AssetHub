import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as util from 'util';

const unlinkFile = util.promisify(fs.unlink);

const storage = diskStorage({
  destination: './uploads', // Adjust the path as needed
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

export { storage, unlinkFile };
