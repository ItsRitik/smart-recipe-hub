const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Recipe submission route
router.post("/recipes", upload.single("image"), (req, res) => {
  const { title, description, instructions, ingredients } = req.body;

  // Combine image path if uploaded
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Recipe object
  const recipe = {
    title,
    description,
    instructions,
    ingredients: JSON.parse(ingredients), // Parse ingredients array
    image: imagePath,
  };

  console.log("Recipe received:", recipe);

  // Mock response (replace with DB logic later)
  return res.status(201).json({
    message: "Recipe submitted successfully!",
    recipe,
  });
});

module.exports = router;
