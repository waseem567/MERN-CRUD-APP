
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
cloudinary.config({
    cloud_name: "dcc9wdqvh",
    api_key: "462141787865991",
    api_secret: "vegzJuspaeyVsIf-9RQB3t_lUdE"
  });
  const uploadToCloudinary = (buffer) => {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.log(error);
              reject(new Error('Failed to upload file to Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.log('error inside uploadation' + error);
    }
  };

module.exports = uploadToCloudinary;