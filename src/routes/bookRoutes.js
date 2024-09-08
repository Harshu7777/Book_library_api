const express = require('express');  // Add this line to import express
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books fetch by User or Post 
 */


/**
 * @swagger
 * /api/books:
 *  get:
 *    summary: Get all books
 *    tags: [Books]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 *  post:
 *    summary: Create a new book
 *    tags: [Books]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      201:
 *        description: Book created
 */
router.route('/')
  .get(getBooks)
  .post(protect, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *    summary: Get a book by ID
 *    tags: [Books]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the book
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: Book not found
 *  put:
 *    summary: Update a book by ID
 *    tags: [Books]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the book
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: Book updated
 *      404:
 *        description: Book not found
 *  delete:
 *    summary: Delete a book by ID
 *    tags: [Books]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the book
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Book deleted
 *      404:
 *        description: Book not found
 */
router.route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;
