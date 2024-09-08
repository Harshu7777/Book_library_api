const asyncHandler = require("../utils/asyncHandler")
const Book = require('../models/bookModel');
const { connectRedis } = require("../config/redis.config");

let redisConnectionClient;

(async () => {
    redisConnectionClient = await connectRedis();
})();

exports.getBooks = asyncHandler(async (req, res) => {
    try {
        // Try to fetch data from Redis
        const allBooks = await redisConnectionClient.get("books");

        if (allBooks) {
            console.log("Data from Redis");
            return res.status(200).json(JSON.parse(allBooks));
        }

        console.log("Data from MongoDB");

        // If not found in Redis, fetch from MongoDB
        const books = await Book.find({});
        await redisConnectionClient.set("books", JSON.stringify(books));

        console.log("Data set in Redis");
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching books", err);
        res.status(500).json({ message: "Error fetching books" });
    }
});

exports.getBookById = asyncHandler(async(req,res) => {
    const book = await Book.findById(req.params.id);
    if(book){
        res.json(book);
    }else{
        res.status(404).json({message:"Book not found"});
    }
});

exports.createBook = asyncHandler(async(req,res) => {

    const {title , author , description , price} = req.body;
    const book = await Book({
        title,
        author,
        description,
        price,
        user:req.body._id,
    })

    const createdBook = await book.save();
    res.status(201).json(createdBook)
});

exports.updateBook = asyncHandler(async(req,res) => {
    const { title, author, description, price } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.price = price || book.price;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

exports.deleteBook = asyncHandler(async(req,res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await book.findByIdAndDelete(req.params.id);

        res.json({ message: 'Book removed Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});