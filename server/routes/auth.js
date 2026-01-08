const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");
const validate = require("../middleware/validation");
const userAuth = require("../middleware/auth");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/register",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .optional()
      .isIn(Object.values(ROLES))
      .withMessage("Invalid role"),
  ]),
  register
);

router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

router.post("/logout", userAuth, logout);
router.get("/me", userAuth, me);

module.exports = router;
