/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-unresolved */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import AWS from 'aws-sdk';
import config from '../config';

// Enter copied or downloaded access id and secret here
const ID = config.AWSAccessKeyId;
const secret = config.AWSSecretKey;

// Enter the name of the bucket that you have created here
const BUCKET_NAME = config.AWSS3BucketName;

// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: secret,
});

const uploadFilesFunction = async (userId) => {
  const files = document.getElementsByClassName('fotos_file');
  const readers = [];
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const result = await new Promise((resolve) => {
      const file = files[i].files[0];
      const reader = new FileReader();
      readers.push(reader);
      reader.onloadend = () => {
        const fileContent = readers[i].result;
        // setting up s3 upload parameters
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${userId}/${i}.jpg`, // file name you want to save as
          Body: fileContent,
          ContentType: 'image/jpeg',
        };

        // Uploading files to the bucket
        s3.upload(params, (err, data) => {
          if (err) {
            throw err;
          }
          resolve(data.Location);
        });
      };
      // read content from the file

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });
    urls.push(result);
  }
  return urls;
};

export default uploadFilesFunction;
