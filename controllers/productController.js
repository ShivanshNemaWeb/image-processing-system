const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const {Product} = require('../models');
const { v4: uuidv4 } = require('uuid');

//API to upload a CSV File
exports.uploadFile = (req, res) => {
    const results = [];
    const requestId = uuidv4();
    const expectedHeaders = ['Product Name', 'Input Image Urls'];
  
    // Function to validate CSV file
    const validateHeaders = (headers) => {
      return expectedHeaders.every(header => headers.includes(header));
    };
  
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('headers', (headers) => {
        if (!validateHeaders(headers)) {
          fs.unlinkSync(req.file.path); // Remove file if headers are invalid
          return res.status(400).json({ error: 'Invalid CSV format. Expected headers are: ' + expectedHeaders.join(', ') });
        }
      })
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Validate each row
          const invalidRows = results.filter(row => !row['Product Name'] || !row['Input Image Urls']);
          if (invalidRows.length > 0) {
            fs.unlinkSync(req.file.path); // Remove file if there are invalid rows
            return res.status(400).json({ error: 'CSV contains invalid rows' });
          }
  
          const products = results.map((row, index) => ({
            serialNumber: index + 1,
            productName: row['Product Name'],
            images: row['Input Image Urls'].split(',').map(url => ({ url: url.trim() })),
            status: 'pending',
            requestId: requestId
          }));
  
          await Product.insertMany(products);
          fs.unlinkSync(req.file.path); // Remove file after processing
  
          res.status(200).json({ requestId: requestId });
        } catch (error) {
          res.status(500).json({ error: 'Failed to process CSV file' });
        }
      });
  };
exports.getStatus = async (req, res) => {
  try {
    const {requestId} = req.params;
    const product = await Product.find({requestId});
    if (!product) return res.status(404).json({ error: 'Products not found' });

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};
