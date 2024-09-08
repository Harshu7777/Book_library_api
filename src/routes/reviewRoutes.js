const express = require('express');
const { 
  createReview, 
  getReviewsByBook, 
  deleteReview 
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management operations
 */

/**
 * @swagger
 * /api/reviews:
 *  post:
 *    summary: Create a new review
 *    tags: [Reviews]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: Review created successfully
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *  get:
 *    summary: Get reviews for a specific book
 *    tags: [Reviews]
 *    parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: ID of the book
 *    responses:
 *      200:
 *        description: Successfully retrieved reviews
 *      404:
 *        description: Book not found
 */
router.get('/book/:bookId', getReviewsByBook);

/**
 * @swagger
 * /api/reviews/{id}:
 *  delete:
 *    summary: Delete a review
 *    tags: [Reviews]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID of the review to delete
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Review deleted successfully
 *      404:
 *        description: Review not found
 */
router.delete('/:id', protect, deleteReview);

module.exports = router;
