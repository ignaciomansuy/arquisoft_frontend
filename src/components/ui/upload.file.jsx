import React from 'react';
import config from '../../config';
import AWS from 'aws-sdk';


export default function UploadFile(props) {
  const ID = config.AWSAccessKeyId;
  const secret = config.AWSSecretKey;

  // Enter the name of the bucket that you have created here
  const BUCKET_NAME = config.AWSS3BucketName;


  // Initializing S3 Interface
  const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: secret
  });

  const uploadFile = (input) => {
      var file   = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();

      reader.onloadend = function () {
          const fileName = "cat3.jfif"
          const fileContent = reader.result;
          // setting up s3 upload parameters
          const params = {
              Bucket: BUCKET_NAME,
              Key: fileName, // file name you want to save as
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
  };
  
  const identifier = `foto_${props.id}`;
  return (
    <div>
      <input
        type="file"
        id={identifier}
        name={identifier}
        onChange={(e) => {
          uploadFile(e)
        }}
      />
    </div>
  );
}
