const { createClient } = require("redis");  // Destructure createClient
require("dotenv").config();

exports.connectRedis = async (req, res) => {
  try {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 10000, // Timeout in milliseconds (10 seconds)
    }
    });

    redisClient.on("error", (err) => console.log("Redis client error:", err));

    redisClient.on("connect", () => console.log("Redis client connected"));
    await redisClient.connect();

    return redisClient;
  } catch (err) {
    console.log("Error connecting to Redis:", err);
    res.status(500).json({ message: "Failed to connect to Redis" });
  }
};
