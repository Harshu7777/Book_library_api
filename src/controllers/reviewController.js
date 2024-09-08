const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, comment } = req.body;

  const existingReview = await Review.findOne({
    user: req.user._id,
    book: bookId,
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const review = new Review({
    user: req.user._id,
    book: bookId,
    rating,
    comment,
  });

  const createdReview = await review.save();

  const book = await Book.findById(bookId);
  if (book) {
    book.numReviews = book.numReviews + 1;
    book.rating = (book.rating * (book.numReviews - 1) + rating) / book.numReviews;
    await book.save();
  }

  res.status(201).json(createdReview);
});

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getReviewsByBook = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');

  if (reviews.length === 0) {
    res.status(404);
    throw new Error('No reviews found for this book');
  }

  res.json(reviews);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await review.remove();

    const book = await Book.findById(review.book);
    if (book) {
      book.numReviews = book.numReviews - 1;
      book.rating =
        book.numReviews > 0
          ? (book.rating * (book.numReviews + 1) - review.rating) / book.numReviews
          : 0;
      await book.save();
    }

    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

module.exports = {
  createReview,
  getReviewsByBook,
  deleteReview,
};
