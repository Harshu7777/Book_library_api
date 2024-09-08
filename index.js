const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize dotenv and connect to DB
dotenv.config();
connectDB();

// Create Express app
const app = express();

// Swagger options and setup
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Express API with Swagger',
            version: '1.0.0',
            description: 'A simple API documentation example using Swagger',
        },
        servers: [
            {
                url: 'http://localhost:4000', 
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(morgan('tiny'));
app.use(express.json());

/**
 * @swagger
 * /:
 *  get:
 *    summary: Test API to check GET request
 *    description: This API is used to test the GET request
 *    responses:
 *      200:
 *        description: Success
 */

app.get('/', (req, res) => {
    res.send('API is working');
});

// Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/books', require('./src/routes/bookRoutes'));
app.use('/api/orders', require('./src/routes/orderRouter'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
);
