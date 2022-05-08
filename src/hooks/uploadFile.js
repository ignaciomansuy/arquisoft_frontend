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

const uploadFilesFunction = (user_id) => {
    var files = document.querySelector('input[type=file]').files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      var file = files[i];
      var reader  = new FileReader();
      console.log(i);
      reader.onloadend = function () {
        const fileContent = reader.result;
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
          console.log(`File uploaded successfully. ${data.Location}`)
        });
      }
      // read content from the file
      
      if (file) {
        reader.readAsArrayBuffer(file);
      }
      else {
        console.log("no files detected");
      }
      i += 1;
    };
};

export default uploadFilesFunction;