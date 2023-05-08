const express = require('express');
const {
  registerController,
  loginController,
  logoutController,
  verifyEmailController
} = require('../controllers/authController')

const router = express.Router();

router.post('./register', registerController);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/verify-email', verifyEmailController)

module.exports = router