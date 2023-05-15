const { StatusCodes } = require('http-status-codes');
const Product = require('../models/product.model');
const CustomError = require('../errors');
// const parsefile = require('../utils/fileparser');
const AWS = require('aws-sdk');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${req.params.id}`);
  };
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${req.params.id}`);
  };

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${req.params.id}`);
  };

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success' });
};

const uploadImage = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${req.params.id}`);
  };

  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  // const maxSize = 1024 * 1024;

  // if (productImage.size > maxSize) {
  //   throw new CustomError.BadRequestError(
  //     'Please upload image smaller than 1MB'
  //   );
  // }

  // to be completed 
  // send image to AWS S3
  // update image to S3 route

  // await fileparser(req)
  //   .then(data => {
  //     console.log(data)
  //     res.status(200).json({
  //       message: "Success",
  //       data
  //     })
  //   })
  //   .catch(error => {
  //     res.status(400).json({
  //       message: "An error occurred.",
  //       error
  //     })
  //   })

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-1',
  });

  const key = `${req.user.id}/${uuid()}.jpeg`

  s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_REGION,
    ContentType: 'image/jpeg',
    Key: key
  }, (err, url) => {
    conole.log(url)
    res.send({ key, url })
  })
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}