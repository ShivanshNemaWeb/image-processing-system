require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');
const sharp = require('sharp');
const {Product} = require('../models');

// Configure AWS SDK
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

const processImages = async () => {
    try {
      const products = await Product.find({ status: 'pending' }).maxTimeMS(60000); 
  
      for (const product of products) {
        try {
          product.status = 'processing';
          await product.save();
  
          const compressedImages = await Promise.all(
            product.images.map(async (image) => {
              const compressedUrl = await compressAndUploadImage(image.url);
              return { ...image, compressedUrl };
            })
          );
  
          product.images = compressedImages;
          product.status = 'completed';
          await product.save();

        } catch (imageProcessError) {
          console.error(`Failed to process product ${product._id}`, imageProcessError);
          product.status = 'error';
          await product.save();
        }
      }
    } catch (dbError) {
      console.error('Failed to fetch products', dbError);
    }
  };
  

const compressAndUploadImage = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  const compressedBuffer = await sharp(buffer).jpeg({ quality: 50 }).toBuffer();

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `compressed/${Date.now()}.jpg`, // Generate a unique filename
    Body: compressedBuffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read', 
  };

  const data = await s3.upload(uploadParams).promise();
  return data.Location; // Return the URL of the uploaded image
};

// Run the worker periodically
console.log("Image processor is running");
setInterval(processImages, 60000);
