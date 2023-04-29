require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/connect');

const authRouter = require('./routers/authRoutes')

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to e-commerce API')
});

app.get('/api/v1', (req, res) => {
  console.log(req.cookies);
  res.send('Welcome to e-commerce API')
});

app.use('/api/v1/auth', authRouter)

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