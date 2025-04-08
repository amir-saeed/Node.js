"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Redis Client
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});
app.use(express_1.default.json());
// Check Redis connection
redis.on("connect", () => console.log("🔌 Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
// Basic Redis SET and GET
app.get("/set", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.set("message", "Hello, Redis!");
    res.send("Message stored in Redis!");
}));
app.get("/get", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield redis.get("message");
    res.send(`Stored Message: ${message}`);
}));
app.get("/data", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redisKey = "api:data";
    try {
        const cachedData = yield redis.get(redisKey);
        if (cachedData) {
            console.log("Cached data");
            return res.json({ source: "Cacheddata", data: JSON.parse(cachedData) });
        }
        // Fetch from API if not cached
        const { data } = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
        // Store in Redis
        yield redis.setex(redisKey, 60, JSON.stringify(data));
        console.log("Non-cached data");
        // Send response
        return res.json({ source: "API", data });
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// docker exec -it redis redis-cli
