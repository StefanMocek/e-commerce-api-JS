const {StatusCodes} = require('http-status-codes');
const User = require('../models/user.model');
const CustomError = require('../errors');
const {attachCookiesToResponse} = require('../utils')

const registerController = async (req, res) => {
  const {name, email, password} = req.body;
  const emailValidator = await User.findOne({email});
  if (emailValidator) {
    throw new CustomError.BadRequestError('Wrong credentials')
  };

  // for dev env and tests
  const isFirstAccount = await user.count({}) === 0;
  const role = isFirstAccount ? 'admin' : ' user';

  const user = await User.create({name, email, password, role});

  const tokenUser = {name: user.name, userId: user._id, role: user.role};
  attachCookiesToResponse({res, user: tokenUser})

  res.status(StatusCodes.CREATED).json({user: tokenUser});
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