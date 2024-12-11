const express = require("express");
const { connectDB } = require("../services/db"); // Import centralized DB connection
const router = express.Router();

router.post("/save-user", async (req, res) => {
  const { clerkUserId, email, name } = req.body;

  console.log(`[${new Date().toISOString()}] Incoming Request:`, req.body);

  if (!clerkUserId || !email || !name) {
    console.error("❌ Invalid user data received");
    return res.status(400).json({ message: "Invalid user data" });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ clerkUserId });
    if (existingUser) {
      console.log("🔎 User already exists:", existingUser);
      return res.status(200).json({ message: "User already exists", user: existingUser });
    }

    // Create new user
    const newUser = {
      clerkUserId,
      email,
      name,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged) {
      const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
      console.log("✅ User saved successfully:", insertedUser);

      return res.status(201).json({ message: "User saved successfully", user: insertedUser });
    } else {
      throw new Error("User insertion failed");
    }
  } catch (error) {
    console.error("❌ Error saving user data:", error.message);
    res.status(500).json({ message: "Failed to save user data" });
  }
});


module.exports = router;
