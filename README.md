# Image Processing System

## Overview

This project is an image processing system that handles uploading, processing, and storing images. The system allows users to upload a CSV file containing image URLs, processes the images by compressing them, and stores them in AWS S3. The system is built using Node.js, Express.js, MongoDB, and various external services.

## Project Structure

image-processing-system
├── controllers
│ ├── index.js
│ ├── productController.js
├── db
│ ├── connection.js
├── models
│ ├── index.js
│ ├── product.js
├── routes
│ ├── index.js
│ ├── product.js
├── workers
│ ├── imageProcessor.js
├── server.js



## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ShivanshNemaWeb/image-processing-system.git
   `cd image-processing-system`
Install dependencies:


`npm install`
## Create a .env file in the root directory and add the following environment variables:


MONGODB_URI,
AWS_REGION,
S3_BUCKET_NAME,
HOST,
PORT,

Usage
Start the Server

`npm start`

## API Endpoints
# Upload a CSV File
URL: /product/upload
Method: POST
Headers: Content-Type: multipart/form-data
Body: Form-data with a key named file and the CSV file as the value.
Response:
200 OK: Returns a JSON object with the requestId.
400 Bad Request: Invalid CSV format or invalid rows.
500 Internal Server Error: Failed to process the CSV file.

# Get Status of a Request
URL: /product/status/:requestId
Method: GET
Response:
200 OK: Returns a JSON object with the product details.
404 Not Found: Products not found for the given requestId.
500 Internal Server Error: Failed to fetch status.

# Asynchronous Worker
The worker script imageProcessor.js runs periodically to process images. It fetches pending products, compresses the images, uploads them to AWS S3, and updates the product status.

## Detailed documentation
https://docs.google.com/document/d/1qqxX9ptYJf5DDHu5EsQM0rLStWM_SLEOG0MBm7fwfeQ/edit?usp=sharing

## Postman collection
https://www.postman.com/lively-sunset-365228/workspace/image-processing-system

## API Base URL
https://image-processing-system-c6fj.onrender.com

