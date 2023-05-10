const express = require('express');
const {
  registerController,
  loginController,
  logoutController,
  verifyEmailController
} = require('../controllers/authController');
const {
  authenticateUser, 
} = require('../middleware/authentication');

const router = express.Router();

router.post('./register', registerController);
router.post('/login', loginController);
router.delete('/logout',authenticateUser, logoutController);
router.post('/verify-email', verifyEmailController)

module.exports = router