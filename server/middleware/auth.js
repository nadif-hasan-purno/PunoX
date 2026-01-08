const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = userAuth;
