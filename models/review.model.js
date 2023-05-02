const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: 'Integers only',
      }
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {timestamps: true}
);

reviewSchema.index({product: 1, user: 1}, {unique: true});

reviewSchema.post('save', async function () {
  console.log('post save hook called');
});

reviewSchema.post('remove', async function () {
  console.log('post remove hook called');
});

module.exports = mongoose.model('Review', reviewSchema);
