import config from '../config';
import AWS from 'aws-sdk';

// Enter copied or downloaded access id and secret here
const ID = config.AWSAccessKeyId;
const secret = config.AWSSecretKey;

// Enter the name of the bucket that you have created here
const BUCKET_NAME = config.AWSS3BucketName;


// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: secret
});

const uploadFilesFunction = async (user_id) => {
  var files = document.getElementsByClassName('fotos_file');
  var readers = [];
  let urls = [];
  for (let i = 0; i < files.length; i++) {
    var result = await new Promise((resolve) => {
      var file = files[i].files[0];
      var reader  = new FileReader();
      readers.push(reader);
      reader.onloadend = function () {
        const fileContent = readers[i].result;
        // setting up s3 upload parameters
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${user_id}/${i}.jpg`, // file name you want to save as
          Body: fileContent,
          ContentType: "image/jpeg"
        };

        // Uploading files to the bucket
         s3.upload(params, function(err, data) {
          if (err) {
            throw err
          }
          resolve(data.Location);
        });
      }
      // read content from the file
      
      if (file) {
        reader.readAsArrayBuffer(file);
      }
      else {
        console.log("no files detected");
      }
    })
    urls.push(result);
  };
  return urls;
};

export default uploadFilesFunction;