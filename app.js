require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to e-commerce API')
});

app.use(notFound);
app.use(errorHandlerMiddleware);

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