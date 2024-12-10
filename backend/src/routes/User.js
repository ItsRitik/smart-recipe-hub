const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();

// Initialize Gemini API Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_LINK);

// Route to generate recipe recommendations
router.post("/gemini-recommend", async (req, res) => {
  const { cuisine, ingredients } = req.body;

  if (!cuisine || !ingredients) {
    return res.status(400).json({ message: "Cuisine and ingredients are required." });
  }

  try {
    // Build the AI prompt
    const prompt = `
      Suggest a recipe based on the following:
      - Cuisine: ${cuisine}
      - Ingredients: ${ingredients.join(", ")}
      Provide:
      - Recipe Title
      - Steps to prepare the dish
    `;

    // Send prompt to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    // Example parsing of response text into a recipe object
    const recommendation = {
      title: "AI Generated Recipe",
      steps: responseText,
      image: "https://via.placeholder.com/300", // Placeholder image for now
    };

    res.status(200).json({ recommendations: [recommendation] }); // Ensure it returns an array
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe recommendations." });
  }
});

module.exports = router;