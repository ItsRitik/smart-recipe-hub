const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const GeminiRoute = require("./routes/gemini"); // User Routes
const UserRoute = require("./routes/user");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// run().catch(console.dir);

// Routes
app.use("/api", GeminiRoute); // User Routes (Public)
app.use("/api", UserRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
