const cloudinary = require("../config/cloudinary");

exports.uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "products" }, (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      })
      .end(buffer);
  });
};
