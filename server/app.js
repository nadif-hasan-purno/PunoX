const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const postRoutes = require("./routes/posts");
const docRoutes = require("./routes/docs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "PunoX CMS API",
  });
});

app.use("/", authRoutes);
app.use("/projects", projectRoutes);
app.use("/posts", postRoutes);
app.use("/docs", docRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Basic error handler to avoid leaking stack traces
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });

module.exports = app;
