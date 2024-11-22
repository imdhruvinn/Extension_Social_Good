const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/extensionDB";

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,      // Use the new URL parser
      useUnifiedTopology: true,   // Use the new Server Discovery and Monitoring engine
    });

    // Optional Mongoose settings to handle deprecations
    mongoose.set("useCreateIndex", true);  // Ensure `createIndexes` is used instead of `ensureIndex`
    mongoose.set("strictQuery", false);    // Remove warnings about `strictQuery` behavior changes

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
