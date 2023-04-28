require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    })
  } catch (err) {
    console.log(err);
  }
};

start();