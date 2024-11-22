const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookiesRoutes = require("./routes/cookiesRoutes");
const browsingRoutes = require("./routes/browsingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());

// Set the limit for the request body payloads
app.use(bodyParser.json({ limit: "10mb" })); // Increase the limit to 10MB or as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api", userRoutes);
app.use("/api", cookiesRoutes);
app.use("/api", browsingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
