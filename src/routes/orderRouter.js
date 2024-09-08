// const express = require('express');
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderToDelivered,
//   getMyOrders,
//   getOrders,
// } = require('../controllers/orderController');
// const { protect, admin } = require('../middlewares/authMiddleware');

// const router = express.Router();

// router.route('/')
//   .post(protect, addOrderItems)
//   .get(protect, admin, getOrders)

// router.route('/myorders').get(protect, getMyOrders);

// router.route('/:id').get(protect, getOrderById);

// router.route('/:id/pay').put(protect, updateOrderToPaid);

// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and operations
 */

/**
 * @swagger
 * /api/orders:
 *  post:
 *    summary: Create a new order
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: Order created
 *  get:
 *    summary: Get all orders (Admin only)
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 */
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

/**
 * @swagger
 * /api/orders/myorders:
 *  get:
 *    summary: Get logged in user's orders
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 */
router.route('/myorders').get(protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *  get:
 *    summary: Get order by ID
 *    tags: [Orders]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Order ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 */
router.route('/:id').get(protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *  put:
 *    summary: Mark order as paid
 *    tags: [Orders]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Order ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 */
router.route('/:id/pay').put(protect, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *  put:
 *    summary: Mark order as delivered (Admin only)
 *    tags: [Orders]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Order ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 */
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
