const config = {
  API_URL: process.env.REACT_APP_API_URL,
  AWSAccessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  AWSSecretKey: process.env.REACT_APP_AWS_SECRET_KEY,
  AWSS3BucketName: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
  AUDIENCE: process.env.REACT_APP_AUDIENCE,
  AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
};

export default config;
