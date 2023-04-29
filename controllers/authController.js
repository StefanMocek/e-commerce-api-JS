const {StatusCodes} = require('http-status-codes');
const User = require('../models/user.model');
const CustomError = require('../errors');

const registerController = async (req, res) => {
  const {name, email, password} = req.body;
  const emailValidator = await User.findOne({email});
  if(emailValidator) {
    throw new CustomError.BadRequestError('Wrong credentials')
  };

  const user = await User.create({name, email, password});
  res.status(StatusCodes.CREATED).json({user});
};

const loginController = async (req, res) => {
  res.send('login')
};

const logoutController = async (req, res) => {
  res.send('logout')
};

module.exports = {
  registerController,
  loginController,
  logoutController
}