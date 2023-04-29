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
  const {email, password} = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  };

  const user = await User.findOne({email});
  if (!user) {
    throw new CustomError.UnauthenticatedError('Wrong credentials')
  };

  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('Wrong credentials')  
  };

  const tokenUser = {name: user.name, userId: user._id, role: user.role};
  attachCookiesToResponse({res, user: tokenUser});

  res.status(StatusCodes.OK).json({user: tokenUser});
};

const logoutController = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).send({message: 'user logout'})
};

module.exports = {
  registerController,
  loginController,
  logoutController
}