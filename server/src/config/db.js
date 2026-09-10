const mongoose = require("mongoose");
require("dotenv").config();

// Set query buffer timeout to 5000ms so queries don't hang indefinitely if DB is disconnected
mongoose.set('bufferTimeoutMS', 5000);

async function connectWithFallback() {
  const mongoURL = process.env.MONGO_URL || "mongodb+srv://codiqsolutions_db_user:fZY2xu1wi76lyCyC@cluster0.ixpfe72.mongodb.net/Loupe";
  const isProd = process.env.NODE_ENV === "production";
  const maskedURL = mongoURL.replace(/:([^:@]{1,})@/, ':****@');

  try {
    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully to:", maskedURL);
    return;
  } catch (err) {
    console.error("[Database Connection Error]:", err?.message || err);
    if (isProd) {
      console.error("[CRITICAL] MongoDB Atlas connection failed in production.");
      console.error("-> If this is Hostinger: Ensure IP Access List in MongoDB Atlas allows 0.0.0.0/0 (Allow Access from Anywhere).");
      // Do NOT kill the process so the web server stays alive to serve static files and diagnostics
      return;
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
