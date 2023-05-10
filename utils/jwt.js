const jwt = require('jsonwebtoken');

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJwt({ payload: { user } });
  const refreshTokenJWT = createJwt({ payload: { user, refreshToken } });

  const tenDays = 1000 * 60 * 60 * 24 * 10;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000 * 5
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + tenDays),
  });
}

// const attachSungleCookieToResponse = ({res, user}) => {
//   const token = createJwt({payload: user});

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true
//   });
// }

module.exports = {
  createJwt,
  isTokenValid,
  attachCookiesToResponse
};
