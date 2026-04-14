const express = require("express");
const {
  signup,
  login,
  getAllUsers,
} = require("../controllers/userAuthController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

/* ADMIN ONLY */
router.get("/all", adminAuth, getAllUsers);

module.exports = router;
