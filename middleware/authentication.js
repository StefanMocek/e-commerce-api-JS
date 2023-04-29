const CustomError = require('../errors');
const {isTokenValid} = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if(!token) {
    console.log('no token');
  } else {
    console.log('token present');
  }
  next();
};

module.exports = {
  authenticateUser
}