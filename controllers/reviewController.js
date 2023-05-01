const {StatusCodes} = require('http-status-codes');
const Review = require('../models/review.model');
const Product = require('../models/product.model');
const CustomError = require('../errors');
const {checkPermissions} = require('../utils')

const createReview = async (req, res) => {
  const {product: productId} = req.body;
  const {userId} = req.user;

  const isValidProduct = await Product.findOne({_id: productId});
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  };

  const alreadyReviewed = await Product.findOne({
    product: productId,
    user: userId
  });

  if (!alreadyReviewed) {
    throw new CustomError.BadRequestError('Already reviewed ')
  };

  req.body.user = userId;
  const review = Review.create(req.body)
  res.status(StatusCodes.CREATED).json({review});
};

const getAllReviews = async (req, res) => {
  res.send('getAllReviews');
};

const getSingleReview = async (req, res) => {
  res.send('getSingleReview');
};

const updateReview = async (req, res) => {
  res.send('updateReview');
};

const deleteReview = async (req, res) => {
  res.send('deleteReview');
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}