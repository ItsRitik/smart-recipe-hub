const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// // MongoDB Connection with Stable API Version
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function connectToDatabase() {
//   try {
//     // Connect to MongoDB using Mongoose and client options
//     await mongoose.connect(process.env.MONGO_URI, clientOptions);
//     console.log("MongoDB connected successfully!");
//   } catch (err) {
//     console.error("MongoDB connection failed", err);
//   }
// }

// // Connect to MongoDB
// connectToDatabase();
const client = new MongoClient(process.env.MONGO_URI, {
  
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
