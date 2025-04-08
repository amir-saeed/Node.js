import express from "express";
import type { Application, Request, Response } from "express";
import Redis from "ioredis";
import dotenv from "dotenv";
import axios from "axios";


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Redis Client
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

app.use(express.json());

// Check Redis connection
redis.on("connect", () => console.log("🔌 Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

// Basic Redis SET and GET
app.get("/set", async (_req: Request, res: Response) => {
  await redis.set("message", "Hello, Redis!");
  res.send("Message stored in Redis!");
});

app.get("/get", async (_req: Request, res: Response) => {
  const message = await redis.get("message");
  res.send(`Stored Message: ${message}`);
});

app.get("/data", async (_req: Request, res: Response) => {  
  const redisKey = "api:data";

  try {
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      console.log("Cached data");
      return res.json({ source: "Cacheddata", data: JSON.parse(cachedData) });
    }

    // Fetch from API if not cached
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");

    // Store in Redis
    await redis.setex(redisKey, 60, JSON.stringify(data));

    console.log("Non-cached data");

    // Send response
    return res.json({ source: "API", data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/session", async (req, res) => {
  const { userId, name } = req.body;

  await redis.set(`session:${userId}`, JSON.stringify({ userId, name }), "EX", 300);

  res.send("Session stored!");
});

app.get("/session/:userId", async (req, res) => {
  const sessionData = await redis.get(`session:${req.params.userId}`);
  if (!sessionData) return res.status(404).send("Session not found!");

  res.json(JSON.parse(sessionData));
});



app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



// docker exec -it redis redis-cli

