const cloudinary = require("cloudinary").v2;

exports.cloudinaryconnect = () => {
  try {
    cloudinary.config({
      cloud_name:'dikmdiqzm',
      api_key: '594457483537378',
      api_secret: 'Tu71OsdSAWIOp9Il9rpXlpXjPiM',
    });
  } catch (error) {
    console.log(error);
  }
};
