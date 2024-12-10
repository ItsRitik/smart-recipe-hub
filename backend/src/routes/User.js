const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/save-user", async (req, res) => {
  const { clerkUserId, email, name } = req.body;

  console.log("Incoming Request:", req.body); // Debug log for incoming request

  if (!clerkUserId || !email || !name) {
    console.log("Invalid user data");
    return res.status(400).json({ message: "Invalid user data" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ clerkUserId });
    console.log("User Check Result:", user);

    if (user) {
      console.log("User already exists:", user);
      return res.status(200).json({ message: "User already exists", user });
    }

    // Create new user
    user = new User({ clerkUserId, email, name });
    await user.save();
    console.log("User saved successfully:", user);

    res.status(201).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user data:", error.message);
    res.status(500).json({ message: "Failed to save user data" });
  }
});

module.exports = router;
