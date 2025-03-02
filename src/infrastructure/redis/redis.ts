import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => console.log("✅ Conectado a Redis"));
redisClient.on("error", (err) => console.error("❌ Error en Redis", err));

export { redisClient };
