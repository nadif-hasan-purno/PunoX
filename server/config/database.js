const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING is not set in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    autoIndex: true,
  });

  console.log("MongoDB connected");
};

module.exports = connectDB;
