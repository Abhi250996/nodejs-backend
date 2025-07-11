require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.SERVER_PORT || 3000;

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware
app.use(express.json());
app.use("/images", express.static("public/images")); // Serve uploaded images

// Routes
const userRoute = require("./routes/user_routes");
app.use("/api", userRoute); // Prefix route

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

// Start server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
