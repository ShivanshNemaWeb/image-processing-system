const express = require('express');
const multer = require('multer');
const {productController} = require('../controllers');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//API to upload a CSV File
router.post('/upload', upload.single('file'), productController.uploadFile);

//Get the status and other data of request id
router.get('/status/:requestId', productController.getStatus);

module.exports = router;
