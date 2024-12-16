const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/User");
const recipeRoutes = require("./routes/Recipe"); // Import the new recipe routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // Serve uploaded images from 'uploads' folder

// MongoDB Connection using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed", err);
  }
}

connectToDatabase();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});
const upload = multer({ storage });

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// API Routes
app.use("/api", userRoutes);
app.use("/api", recipeRoutes); // Use the recipe routes for handling recipe submissions

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
