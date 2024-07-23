const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http')
const routes = require('./routes/index');
const imageProcessor = require('./workers/imageProcessor');
const { connectDb } = require('./db/connection');

require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT || 3000
const app = express();

// Parse incoming JSON
app.use(express.json());
app.use(cors());
// Set up routes
app.use('/', routes);
app.get('/',(req,res)=>{res.send("Server is Live!!!")});

const server = http.createServer(app);

// Connect to MongoDB
connectDb()
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    server.listen(port, () => {
      console.log(`Server running at ${host}:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
