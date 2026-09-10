const mongoose = require("mongoose");
require("dotenv").config();

async function connectWithFallback() {
  const mongoURL = process.env.MONGO_URL || "mongodb+srv://codiqsolutions_db_user:fZY2xu1wi76lyCyC@cluster0.ixpfe72.mongodb.net/Loupe";
  const isProd = process.env.NODE_ENV === "production";
  const maskedURL = mongoURL.replace(/:([^:@]{1,})@/, ':****@');

  try {
    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("MongoDB connected successfully to:", maskedURL);
    return;
  } catch (err) {
    console.error("Primary DB connection failed:", err?.message || err);
    if (isProd) {
      console.error("[CRITICAL] Cannot fallback to in-memory database in production mode. Check MONGO_URL and IP whitelist.");
      process.exit(1);
    }
    console.log("Falling back to in-memory MongoDB for local development...");
  }

  // Fallback: in-memory MongoDB for local dev
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    await mongoose.connect(uri);
    console.log("Connected to in-memory MongoDB.");
  } catch (memErr) {
    console.error("In-memory MongoDB fallback also failed:", memErr?.message || memErr);
    process.exit(1);
  }
}

const connectDB = () => connectWithFallback();

module.exports = { connectDB };
