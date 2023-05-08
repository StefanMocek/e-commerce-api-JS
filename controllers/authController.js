const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const emailValidator = await User.findOne({ email });
  if (emailValidator) {
    throw new CustomError.BadRequestError('Wrong credentials')
  };

  // for dev env and tests
  const isFirstAccount = await user.count({}) === 0;
  const role = isFirstAccount ? 'admin' : ' user';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({ name, email, password, role, verificationToken });

  // temoporary sending the verificationToken - juest for test in postman
  res.status(StatusCodes.CREATED).json({ msg: 'success - chceck your email', verificationToken })
};

const verifyEmailController = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed')
  };
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification failed')
  };

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Email verified' });
}

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  };

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Wrong credentials')
  };

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Wrong credentials')
  };

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email')
  };

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logoutController = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).send({ message: 'user logout' })
};

module.exports = {
  registerController,
  verifyEmailController,
  loginController,
  logoutController
}