const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require('../utils');

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const emailValidator = await User.findOne({ email });
  if (emailValidator) {
    throw new CustomError.BadRequestError('Wrong credentials')
  };

  // for dev env and tests
  const isFirstAccount = await user.count({}) === 0;
  const role = isFirstAccount ? 'admin' : ' user';

  const orgigin = 'http://localhost:3000';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({ name, email, password, role, verificationToken });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken,
    origin
  });

  res.status(StatusCodes.CREATED).json({ msg: 'success - chceck your email' })
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

  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Wrong credentials')
    };
    refreshToken = existingToken.existingToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logoutController = async (req, res) => {
  await Token.findOneAndDelete({user: req.user.userId})

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).send({ message: 'user logout' })
};

const forgotPasswordController = async (req, res) => {
  res.send('forgotPasswordController');
};

const resetPasswordController = async (req, res) => {
  res.send('resetPasswordController');
};

module.exports = {
  registerController,
  verifyEmailController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController
}