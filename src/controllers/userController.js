const User = require('../models/userModel');
const generateToken = require("../utils/generateToken")

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate the request body
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate the request body
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
