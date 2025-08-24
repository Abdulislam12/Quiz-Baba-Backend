require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middlewares
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api", uploadRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
