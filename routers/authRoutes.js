const express = require('express');
const {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController
} = require('../controllers/authController');
const {
  authenticateUser, 
} = require('../middleware/authentication');

const router = express.Router();

router.post('./register', registerController);
router.post('/login', loginController);
router.delete('/logout',authenticateUser, logoutController);
router.post('/verify-email', verifyEmailController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);

module.exports = router