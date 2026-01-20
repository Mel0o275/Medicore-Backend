const { createClient } = require("redis");
require("dotenv").config();

let redisClient;

if (!global.redisClient) {
  global.redisClient = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  global.redisClient.on("error", (err) =>
    console.error("Redis Client Error", err)
  );
}

redisClient = global.redisClient;

module.exports = redisClient;
