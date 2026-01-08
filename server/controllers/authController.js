const User = require("../models/User");
const { ROLES, getCookieOptions } = require("../utils/constants");

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (role && !Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      role: role || ROLES.EDITOR,
    });

    const token = user.getJWT();
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.getJWT();
    res.cookie("token", token, getCookieOptions());

    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", getCookieOptions());
  return res.json({ message: "Logged out" });
};

exports.me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please login" });
  }
  return res.json({ user: sanitizeUser(req.user) });
};
