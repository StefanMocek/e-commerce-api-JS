const express = require('express');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} = require('../controllers/productController');
const {
  authenticateUser, 
  authorizePermissions
} = require('../middleware/authentication');

const router = express.Router();

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage/:id')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('adimn')], updateProduct)
  .delete([authenticateUser, authorizePermissions('adimn')], deleteProduct)


module.exports = router
