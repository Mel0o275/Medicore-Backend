// redisClient.js


const {createClient} = require("redis")
require("dotenv").config();

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();

  await redisClient.set("foo", "bar");
  const result = await redisClient.get("foo");
  console.log(result); // >>> bar
})();

module.exports = redisClient;
