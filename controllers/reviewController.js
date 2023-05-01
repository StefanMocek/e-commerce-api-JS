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
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({products, count: products.length});
};

const getSingleReview = async (req, res) => {
  const {id: reviewId} = req.params;
  const review = await Review.findOne({_id: reviewId});

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`);
  };
  res.status(StatusCodes.OK).json({review});
};

const updateReview = async (req, res) => {
  const {rating, title, comment} = req.body;
  const {id: reviewId} = req.params;
  const review = await Review.findOne({_id: reviewId});

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`);
  };

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({review});
};

const deleteReview = async (req, res) => {
  const {id: reviewId} = req.params;
  const review = await Review.findOne({_id: reviewId});

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`);
  };

  checkPermissions(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({msg: 'Success'});
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}