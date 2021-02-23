import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class MediaService {
  public upload(file: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
      stream.end(file);
    });
  }
}
