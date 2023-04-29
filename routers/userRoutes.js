const express = require('express');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user.Controller');
const {authenticateUser} = require('../middleware/authentication');

const router = express.Router();

router.route('/').get(authenticateUser, getAllUsers);

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;