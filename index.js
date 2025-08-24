require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const serverless = require("serverless-http");

const app = express();

// Middlewares
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api", uploadRoutes);

// ❌ remove app.listen (Vercel doesn’t allow persistent servers)
// ✅ export as a serverless handler
module.exports = app;
module.exports.handler = serverless(app);
